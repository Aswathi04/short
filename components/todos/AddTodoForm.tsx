"use client";

import { useState } from "react";
import type { Todo } from "@/types";

interface AddTodoFormProps {
  onAdd: (todo: Todo) => void;
}

export default function AddTodoForm({ onAdd }: AddTodoFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setLoading(true);

    const res = await fetch("/api/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description, due_date: dueDate || null }),
    });

    if (res.ok) {
      const { todo } = await res.json();
      onAdd(todo);
      setTitle("");
      setDescription("");
      setDueDate("");
      setExpanded(false);
    }
    setLoading(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-surface-card border border-surface-border rounded-lg p-5 shadow-[0_1px_3px_rgba(40,36,32,0.03)] space-y-3.5"
    >
      <div className="flex gap-2.5">
        <input
          type="text"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (!expanded && e.target.value) setExpanded(true);
          }}
          placeholder="Record a new task or reading objective…"
          className="flex-1 bg-surface-subtle border border-surface-border rounded-md px-4 py-2.5 text-sm text-ink placeholder-ink-muted/60 focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent font-sans transition-colors"
        />
        <button
          type="submit"
          disabled={loading || !title.trim()}
          className="bg-accent hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-sans font-medium px-4 py-2.5 rounded-md transition-all shadow-sm whitespace-nowrap"
        >
          {loading ? "Recording…" : "Record Task"}
        </button>
      </div>

      {expanded && (
        <div className="space-y-3 pt-1 font-sans">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            placeholder="Context, references, or reading notes (optional)…"
            className="w-full bg-surface-subtle border border-surface-border rounded-md px-4 py-2 text-sm text-ink placeholder-ink-muted/60 focus:outline-none focus:ring-1 focus:ring-accent resize-none transition-colors"
          />
          <div className="flex items-center gap-2 text-xs text-ink-muted">
            <span>Target completion:</span>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="bg-surface-subtle border border-surface-border rounded-md px-3 py-1.5 text-xs text-ink focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </div>
        </div>
      )}
    </form>
  );
}

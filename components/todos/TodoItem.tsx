"use client";

import { useState } from "react";
import type { Todo } from "@/types";

interface TodoItemProps {
  todo: Todo;
  onUpdate: (updated: Todo) => void;
  onDelete: (id: string) => void;
}

export default function TodoItem({ todo, onUpdate, onDelete }: TodoItemProps) {
  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [editDesc, setEditDesc] = useState(todo.description ?? "");
  const [editDue, setEditDue] = useState(todo.due_date ?? "");
  const [saving, setSaving] = useState(false);

  const isOverdue =
    !todo.is_done &&
    todo.due_date &&
    new Date(todo.due_date) < new Date(new Date().toDateString());

  const handleToggle = async () => {
    const res = await fetch(`/api/todos/${todo.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_done: !todo.is_done }),
    });
    if (res.ok) {
      const { todo: updated } = await res.json();
      onUpdate(updated);
    }
  };

  const handleSaveEdit = async () => {
    if (!editTitle.trim()) return;
    setSaving(true);
    const res = await fetch(`/api/todos/${todo.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: editTitle,
        description: editDesc,
        due_date: editDue || null,
      }),
    });
    if (res.ok) {
      const { todo: updated } = await res.json();
      onUpdate(updated);
      setEditing(false);
    }
    setSaving(false);
  };

  const handleDelete = async () => {
    if (!confirm("Remove this entry from the ledger?")) return;
    await fetch(`/api/todos/${todo.id}`, { method: "DELETE" });
    onDelete(todo.id);
  };

  return (
    <div
      className={`border rounded-lg p-4 transition-all ${
        todo.is_done
          ? "bg-surface-subtle/50 border-surface-border opacity-70"
          : isOverdue
          ? "bg-[#FCF9F7] border-accent-border shadow-[0_1px_3px_rgba(162,72,43,0.05)]"
          : "bg-surface-card border-surface-border shadow-[0_1px_3px_rgba(40,36,32,0.03)] hover:border-surface-borderStrong"
      }`}
    >
      {editing ? (
        <div className="space-y-3 font-sans">
          <input
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="w-full bg-surface-subtle border border-surface-border rounded-md px-3 py-2 text-sm text-ink focus:outline-none focus:ring-1 focus:ring-accent"
            placeholder="Task title"
          />
          <textarea
            value={editDesc}
            onChange={(e) => setEditDesc(e.target.value)}
            rows={2}
            className="w-full bg-surface-subtle border border-surface-border rounded-md px-3 py-2 text-sm text-ink placeholder-ink-muted/60 focus:outline-none focus:ring-1 focus:ring-accent resize-none"
            placeholder="Notes or description (optional)"
          />
          <div className="flex items-center gap-2">
            <span className="text-xs text-ink-muted">Due date:</span>
            <input
              type="date"
              value={editDue}
              onChange={(e) => setEditDue(e.target.value)}
              className="bg-surface-subtle border border-surface-border rounded-md px-3 py-1.5 text-xs text-ink focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </div>
          <div className="flex gap-2 pt-1">
            <button
              onClick={handleSaveEdit}
              disabled={saving}
              className="bg-accent hover:bg-accent-hover disabled:opacity-50 text-white text-xs font-medium px-4 py-1.5 rounded-md transition-colors"
            >
              {saving ? "Saving…" : "Save Changes"}
            </button>
            <button
              onClick={() => setEditing(false)}
              className="text-ink-muted hover:text-ink text-xs px-3 py-1.5 rounded-md hover:bg-paper-hover transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-start gap-3.5">
          <button
            onClick={handleToggle}
            className={`mt-0.5 shrink-0 w-4 h-4 rounded-sm border flex items-center justify-center transition-colors ${
              todo.is_done
                ? "bg-accent border-accent text-white"
                : "border-surface-borderStrong hover:border-accent bg-surface-card"
            }`}
          >
            {todo.is_done && (
              <svg className="h-2.5 w-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            )}
          </button>

          <div className="flex-1 min-w-0">
            <p
              className={`font-serif text-[15px] leading-snug ${
                todo.is_done
                  ? "line-through text-ink-muted italic"
                  : "text-ink font-medium"
              }`}
            >
              {todo.title}
            </p>
            {todo.description && (
              <p className="font-sans text-xs text-ink-secondary mt-1 leading-relaxed">
                {todo.description}
              </p>
            )}
            {todo.due_date && (
              <p
                className={`font-sans text-[11px] mt-1.5 flex items-center gap-1 ${
                  isOverdue ? "text-accent font-semibold" : "text-ink-muted"
                }`}
              >
                <span>{isOverdue ? "§ Overdue ·" : "📅 Due"}</span>
                <span>
                  {new Date(todo.due_date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </p>
            )}
          </div>

          <div className="flex items-center gap-1 shrink-0 font-sans">
            <button
              onClick={() => setEditing(true)}
              className="p-1.5 text-ink-faint hover:text-ink hover:bg-paper-hover rounded transition-colors"
              title="Edit entry"
            >
              <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              onClick={handleDelete}
              className="p-1.5 text-ink-faint hover:text-accent hover:bg-accent-light/50 rounded transition-colors"
              title="Remove entry"
            >
              <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

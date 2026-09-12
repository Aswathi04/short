"use client";

import { useState } from "react";
import type { Reminder } from "@/types";

interface AddReminderFormProps {
  onAdd: (reminder: Reminder) => void;
}

export default function AddReminderForm({ onAdd }: AddReminderFormProps) {
  const [title, setTitle] = useState("");
  const [remindAt, setRemindAt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !remindAt) return;
    setError(null);
    setLoading(true);

    const res = await fetch("/api/reminders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        remind_at: new Date(remindAt).toISOString(),
      }),
    });

    if (res.ok) {
      const { reminder } = await res.json();
      onAdd(reminder);
      setTitle("");
      setRemindAt("");
    } else {
      const data = await res.json();
      setError(data.error || "Failed to schedule reminder");
    }
    setLoading(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-surface-card border border-surface-border rounded-lg p-5 shadow-[0_1px_3px_rgba(40,36,32,0.03)] space-y-3 font-sans"
    >
      <div className="flex flex-col sm:flex-row gap-2.5">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Schedule a notice or follow-up…"
          required
          className="flex-1 min-w-48 bg-surface-subtle border border-surface-border rounded-md px-4 py-2.5 text-sm text-ink placeholder-ink-muted/60 focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-colors"
        />
        <input
          type="datetime-local"
          value={remindAt}
          onChange={(e) => setRemindAt(e.target.value)}
          required
          className="bg-surface-subtle border border-surface-border rounded-md px-3 py-2.5 text-xs text-ink focus:outline-none focus:ring-1 focus:ring-accent transition-colors"
        />
        <button
          type="submit"
          disabled={loading || !title.trim() || !remindAt}
          className="bg-accent hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-medium px-4 py-2.5 rounded-md transition-all shadow-sm whitespace-nowrap"
        >
          {loading ? "Scheduling…" : "Set Reminder"}
        </button>
      </div>
      {error && (
        <p className="text-xs text-accent font-serif italic pt-0.5">{error}</p>
      )}
    </form>
  );
}

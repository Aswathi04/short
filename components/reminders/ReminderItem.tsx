"use client";

import { useState } from "react";
import type { Reminder } from "@/types";

interface ReminderItemProps {
  reminder: Reminder;
  onUpdate: (updated: Reminder) => void;
  onDelete: (id: string) => void;
}

type ReminderStatus = "overdue" | "today" | "upcoming" | "done";

function getStatus(reminder: Reminder): ReminderStatus {
  if (reminder.is_done) return "done";
  const now = new Date();
  const remindAt = new Date(reminder.remind_at);
  if (remindAt < now) return "overdue";
  const todayEnd = new Date(now.toDateString());
  todayEnd.setDate(todayEnd.getDate() + 1);
  if (remindAt < todayEnd) return "today";
  return "upcoming";
}

const statusConfig = {
  overdue: {
    label: "Overdue",
    className: "bg-badge-rose-bg text-badge-rose-text border-badge-rose-border",
  },
  today: {
    label: "Due Today",
    className: "bg-badge-ochre-bg text-badge-ochre-text border-badge-ochre-border",
  },
  upcoming: {
    label: "Upcoming",
    className: "bg-badge-sand-bg text-badge-sand-text border-badge-sand-border",
  },
  done: {
    label: "Settled",
    className: "bg-surface-subtle text-ink-muted border-surface-border",
  },
};

export default function ReminderItem({ reminder, onUpdate, onDelete }: ReminderItemProps) {
  const [deleting, setDeleting] = useState(false);
  const status = getStatus(reminder);
  const { label, className } = statusConfig[status];

  const handleToggleDone = async () => {
    const res = await fetch(`/api/reminders/${reminder.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_done: !reminder.is_done }),
    });
    if (res.ok) {
      const { reminder: updated } = await res.json();
      onUpdate(updated);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Remove this reminder?")) return;
    setDeleting(true);
    await fetch(`/api/reminders/${reminder.id}`, { method: "DELETE" });
    onDelete(reminder.id);
  };

  const formattedDate = new Date(reminder.remind_at).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

  return (
    <div
      className={`border rounded-lg p-4 transition-all ${
        status === "overdue"
          ? "bg-[#FDF9F7] border-accent-border shadow-[0_1px_3px_rgba(162,72,43,0.06)]"
          : status === "today"
          ? "bg-[#FAF7EF] border-badge-ochre-border/80"
          : "bg-surface-card border-surface-border shadow-[0_1px_3px_rgba(40,36,32,0.03)] hover:border-surface-borderStrong"
      } ${reminder.is_done ? "opacity-65 bg-surface-subtle/50" : ""}`}
    >
      <div className="flex items-start gap-3.5">
        <button
          onClick={handleToggleDone}
          className={`mt-0.5 shrink-0 w-4 h-4 rounded-sm border flex items-center justify-center transition-colors ${
            reminder.is_done
              ? "bg-accent border-accent text-white"
              : "border-surface-borderStrong hover:border-accent bg-surface-card"
          }`}
        >
          {reminder.is_done && (
            <svg className="h-2.5 w-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </button>

        <div className="flex-1 min-w-0">
          <p
            className={`font-serif text-[15px] leading-snug ${
              reminder.is_done
                ? "line-through text-ink-muted italic"
                : "text-ink font-medium"
            }`}
          >
            {reminder.title}
          </p>
          <p className="font-sans text-xs text-ink-muted mt-1 flex items-center gap-1.5">
            <span>🕰️</span>
            <span>{formattedDate}</span>
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0 font-sans">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-[11px] font-medium border ${className}`}>
            {label}
          </span>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="p-1.5 text-ink-faint hover:text-accent hover:bg-accent-light/50 rounded transition-colors"
            title="Remove reminder"
          >
            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

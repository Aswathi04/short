"use client";

import { useState } from "react";
import type { Reminder } from "@/types";
import ReminderItem from "@/components/reminders/ReminderItem";
import AddReminderForm from "@/components/reminders/AddReminderForm";

interface RemindersClientProps {
  initialReminders: Reminder[];
}

export default function RemindersClient({ initialReminders }: RemindersClientProps) {
  const [reminders, setReminders] = useState<Reminder[]>(initialReminders);

  const handleAdd = (reminder: Reminder) => {
    setReminders((prev) =>
      [...prev, reminder].sort(
        (a, b) => new Date(a.remind_at).getTime() - new Date(b.remind_at).getTime()
      )
    );
  };

  const handleUpdate = (updated: Reminder) => {
    setReminders((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
  };

  const handleDelete = (id: string) => {
    setReminders((prev) => prev.filter((r) => r.id !== id));
  };

  const now = new Date();
  const upcoming = reminders.filter((r) => !r.is_done && new Date(r.remind_at) >= now);
  const overdue = reminders.filter((r) => !r.is_done && new Date(r.remind_at) < now);
  const done = reminders.filter((r) => r.is_done);

  return (
    <div className="space-y-8 max-w-2xl">
      <AddReminderForm onAdd={handleAdd} />

      {reminders.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-surface-border rounded-lg bg-surface-card/40">
          <p className="font-serif text-2xl text-ink-muted/50 mb-1.5">🕰</p>
          <p className="font-serif text-base text-ink-secondary">
            No active reminders scheduled.
          </p>
          <p className="text-xs text-ink-muted mt-1 font-sans">
            Set a date and time above to track upcoming notices and deadlines.
          </p>
        </div>
      ) : (
        <>
          {overdue.length > 0 && (
            <div className="space-y-3">
              <div className="border-b border-accent-border/60 pb-1.5 flex items-baseline justify-between">
                <h3 className="font-serif text-xs font-semibold tracking-wider uppercase text-accent flex items-center gap-1.5">
                  <span>§ Past Due</span>
                </h3>
                <span className="text-[11px] font-sans text-accent font-medium">
                  {overdue.length} item{overdue.length === 1 ? "" : "s"}
                </span>
              </div>
              <div className="space-y-2.5">
                {overdue.map((r) => (
                  <ReminderItem key={r.id} reminder={r} onUpdate={handleUpdate} onDelete={handleDelete} />
                ))}
              </div>
            </div>
          )}

          {upcoming.length > 0 && (
            <div className="space-y-3">
              <div className="border-b border-surface-border pb-1.5 flex items-baseline justify-between">
                <h3 className="font-serif text-xs font-semibold tracking-wider uppercase text-ink-secondary">
                  Forthcoming Dates
                </h3>
                <span className="text-[11px] font-sans text-ink-muted">
                  {upcoming.length} scheduled
                </span>
              </div>
              <div className="space-y-2.5">
                {upcoming.map((r) => (
                  <ReminderItem key={r.id} reminder={r} onUpdate={handleUpdate} onDelete={handleDelete} />
                ))}
              </div>
            </div>
          )}

          {done.length > 0 && (
            <div className="space-y-3 pt-2">
              <div className="border-b border-surface-border pb-1.5 flex items-baseline justify-between">
                <h3 className="font-serif text-xs font-semibold tracking-wider uppercase text-ink-muted">
                  Settled Reminders
                </h3>
                <span className="text-[11px] font-sans text-ink-muted">
                  {done.length} item{done.length === 1 ? "" : "s"}
                </span>
              </div>
              <div className="space-y-2.5">
                {done.map((r) => (
                  <ReminderItem key={r.id} reminder={r} onUpdate={handleUpdate} onDelete={handleDelete} />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

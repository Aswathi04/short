import { createClient } from "@/lib/supabase/server";
import RemindersClient from "@/components/reminders/RemindersClient";
import type { Reminder } from "@/types";

export default async function RemindersPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data } = await supabase
    .from("reminders")
    .select("*")
    .eq("user_id", user?.id ?? "")
    .order("remind_at", { ascending: true });

  const reminders: Reminder[] = data ?? [];

  return (
    <div>
      {/* Editorial Masthead */}
      <header className="mb-10 pb-6 border-b border-surface-border">
        <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2">
          <div>
            <h1 className="font-serif text-3xl sm:text-4xl font-semibold tracking-tight text-ink">
              Chronicle of Reminders
            </h1>
            <p className="text-sm text-ink-secondary mt-1.5 font-serif italic">
              Time-sensitive follow-ups, applications, and scheduled readings.
            </p>
          </div>
          <div className="text-[11px] font-sans uppercase tracking-widest text-ink-muted">
            Tickler · Calendar
          </div>
        </div>
      </header>

      <RemindersClient initialReminders={reminders} />
    </div>
  );
}

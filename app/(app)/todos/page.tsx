import { createClient } from "@/lib/supabase/server";
import TodosClient from "@/components/todos/TodosClient";
import type { Todo } from "@/types";

export default async function TodosPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data } = await supabase
    .from("todos")
    .select("*")
    .eq("user_id", user?.id ?? "")
    .order("created_at", { ascending: false });

  const todos: Todo[] = data ?? [];

  return (
    <div>
      {/* Editorial Masthead */}
      <header className="mb-10 pb-6 border-b border-surface-border">
        <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2">
          <div>
            <h1 className="font-serif text-3xl sm:text-4xl font-semibold tracking-tight text-ink">
              Task Ledger
            </h1>
            <p className="text-sm text-ink-secondary mt-1.5 font-serif italic">
              Record objectives, follow-ups, and reading milestones.
            </p>
          </div>
          <div className="text-[11px] font-sans uppercase tracking-widest text-ink-muted">
            Docket · Action Items
          </div>
        </div>
      </header>

      <TodosClient initialTodos={todos} />
    </div>
  );
}

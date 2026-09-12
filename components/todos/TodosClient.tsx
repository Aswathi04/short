"use client";

import { useState } from "react";
import type { Todo } from "@/types";
import TodoItem from "@/components/todos/TodoItem";
import AddTodoForm from "@/components/todos/AddTodoForm";

interface TodosClientProps {
  initialTodos: Todo[];
}

export default function TodosClient({ initialTodos }: TodosClientProps) {
  const [todos, setTodos] = useState<Todo[]>(initialTodos);

  const handleAdd = (todo: Todo) => {
    setTodos((prev) => [todo, ...prev]);
  };

  const handleUpdate = (updated: Todo) => {
    setTodos((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
  };

  const handleDelete = (id: string) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  };

  const active = todos.filter((t) => !t.is_done);
  const done = todos.filter((t) => t.is_done);

  return (
    <div className="space-y-8 max-w-2xl">
      <AddTodoForm onAdd={handleAdd} />

      {active.length === 0 && done.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-surface-border rounded-lg bg-surface-card/40">
          <p className="font-serif text-2xl text-ink-muted/50 mb-1.5">✒</p>
          <p className="font-serif text-base text-ink-secondary">
            No entries inscribed in your ledger.
          </p>
          <p className="text-xs text-ink-muted mt-1 font-sans">
            Add a reading goal, application deadline, or task above.
          </p>
        </div>
      ) : (
        <>
          {active.length > 0 && (
            <div className="space-y-3">
              <div className="border-b border-surface-border pb-1.5 flex items-baseline justify-between">
                <h3 className="font-serif text-xs font-semibold tracking-wider uppercase text-ink-secondary">
                  Pending Objectives
                </h3>
                <span className="text-[11px] font-sans text-ink-muted">
                  {active.length} item{active.length === 1 ? "" : "s"}
                </span>
              </div>
              <div className="space-y-2.5">
                {active.map((todo) => (
                  <TodoItem
                    key={todo.id}
                    todo={todo}
                    onUpdate={handleUpdate}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            </div>
          )}

          {done.length > 0 && (
            <div className="space-y-3 pt-2">
              <div className="border-b border-surface-border pb-1.5 flex items-baseline justify-between">
                <h3 className="font-serif text-xs font-semibold tracking-wider uppercase text-ink-muted">
                  Completed Dispatches
                </h3>
                <span className="text-[11px] font-sans text-ink-muted">
                  {done.length} item{done.length === 1 ? "" : "s"}
                </span>
              </div>
              <div className="space-y-2.5">
                {done.map((todo) => (
                  <TodoItem
                    key={todo.id}
                    todo={todo}
                    onUpdate={handleUpdate}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

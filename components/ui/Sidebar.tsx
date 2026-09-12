"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const navItems = [
  { href: "/", label: "Library", icon: "📖" },
  { href: "/todos", label: "To-do Ledger", icon: "✒️" },
  { href: "/reminders", label: "Reminders", icon: "🕰️" },
];

export default function Sidebar({ userEmail }: { userEmail: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <aside className="fixed top-0 left-0 h-full w-64 bg-paper-subtle border-r border-surface-border flex flex-col z-10">
      {/* Editorial Masthead Logo */}
      <div className="px-6 py-7 border-b border-surface-border">
        <div className="flex items-baseline gap-2">
          <h1 className="font-serif text-2xl font-semibold tracking-tight text-ink">
            Short
          </h1>
          <span className="text-[10px] uppercase tracking-widest font-sans font-medium text-accent">
            Digest
          </span>
        </div>
        <p className="text-xs text-ink-muted mt-1.5 truncate font-sans">
          {userEmail}
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-6 space-y-1 font-sans">
        <div className="px-3 pb-2 text-[11px] uppercase tracking-wider font-semibold text-ink-muted">
          Sections
        </div>
        {navItems.map(({ href, label, icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all ${
                isActive
                  ? "bg-surface-card text-ink font-semibold shadow-sm border border-surface-border/60"
                  : "text-ink-secondary hover:text-ink hover:bg-paper-hover"
              }`}
            >
              <span className="text-base opacity-80">{icon}</span>
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer / Sign Out */}
      <div className="px-4 py-5 border-t border-surface-border">
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-medium text-ink-muted hover:text-accent hover:bg-accent-light/50 transition-colors"
        >
          <span>↩</span>
          Sign out
        </button>
      </div>
    </aside>
  );
}

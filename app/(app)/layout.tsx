import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Sidebar from "@/components/ui/Sidebar";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  return (
    <div className="flex min-h-screen bg-paper">
      <Sidebar userEmail={user.email ?? ""} />
      <main className="flex-1 ml-64 min-h-screen px-8 py-10 lg:px-14 lg:py-12 max-w-6xl">
        {children}
      </main>
    </div>
  );
}

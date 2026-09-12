import { createClient } from "@/lib/supabase/server";
import LibraryClient from "@/components/links/LibraryClient";
import type { Link, Tag } from "@/types";

export default async function LibraryPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Fetch links with tags
  const { data: linksData } = await supabase
    .from("links")
    .select(`
      *,
      tags:link_tags(tag:tags(*))
    `)
    .eq("user_id", user?.id ?? "")
    .order("created_at", { ascending: false });

  // Fetch all tags for filter dropdown
  const { data: tagsData } = await supabase
    .from("tags")
    .select("*")
    .eq("user_id", user?.id ?? "")
    .order("name");

  type RawLinkItem = Omit<Link, "tags"> & {
    tags?: Array<{ tag: Tag | null }>;
  };

  // Flatten nested tag structure
  const rawItems = (linksData ?? []) as unknown as RawLinkItem[];
  const links: Link[] = rawItems.map((link) => ({
    ...link,
    tags: (link.tags ?? []).map((lt) => lt.tag).filter((t): t is Tag => Boolean(t)),
  }));

  const allTags: Tag[] = tagsData ?? [];

  return (
    <div>
      {/* Editorial Masthead */}
      <header className="mb-10 pb-6 border-b border-surface-border">
        <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2">
          <div>
            <h1 className="font-serif text-3xl sm:text-4xl font-semibold tracking-tight text-ink">
              Reading Library
            </h1>
            <p className="text-sm text-ink-secondary mt-1.5 font-serif italic">
              A curated repository of articles, essays, and career notices.
            </p>
          </div>
          <div className="text-[11px] font-sans uppercase tracking-widest text-ink-muted">
            Personal Digest
          </div>
        </div>
      </header>

      <LibraryClient initialLinks={links} allTags={allTags} />
    </div>
  );
}

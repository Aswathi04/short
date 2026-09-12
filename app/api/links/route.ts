import { createClient } from "@/lib/supabase/server";
import { extractContent } from "@/lib/readability";
import { summarizeContent } from "@/lib/gemini";
import { NextResponse } from "next/server";
import type { Link, Tag } from "@/types";

// GET /api/links — return all links with tags for the current user
export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: linksData, error } = await supabase
    .from("links")
    .select(`*, tags:link_tags(tag:tags(*))`)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  type RawLinkItem = Omit<Link, "tags"> & {
    tags?: Array<{ tag: Tag | null }>;
  };

  const rawItems = (linksData ?? []) as unknown as RawLinkItem[];
  const links: Link[] = rawItems.map((link) => ({
    ...link,
    tags: (link.tags ?? []).map((lt) => lt.tag).filter((t): t is Tag => Boolean(t)),
  }));

  return NextResponse.json({ links });
}

// POST /api/links — fetch URL, summarize, save
export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: { url?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { url } = body;
  if (!url || typeof url !== "string") {
    return NextResponse.json({ error: "URL is required" }, { status: 400 });
  }

  // Validate URL
  try {
    new URL(url);
  } catch {
    return NextResponse.json({ error: "Invalid URL format" }, { status: 400 });
  }

  // Step 1: Extract content
  let extracted: Awaited<ReturnType<typeof extractContent>>;
  try {
    extracted = await extractContent(url);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to fetch the URL";
    return NextResponse.json(
      { error: `Could not fetch the page: ${msg}` },
      { status: 422 }
    );
  }

  // Step 2: Summarize with Gemini
  let summary: Awaited<ReturnType<typeof summarizeContent>>;
  try {
    summary = await summarizeContent(extracted.text || extracted.title);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Summarization failed";
    return NextResponse.json(
      { error: `AI summarization failed: ${msg}` },
      { status: 422 }
    );
  }

  // Step 3: Insert link
  const { data: link, error: linkError } = await supabase
    .from("links")
    .insert({
      user_id: user.id,
      url,
      title: extracted.title,
      summary: summary.summary,
      content_type: summary.content_type,
      favicon_url: extracted.faviconUrl,
    })
    .select()
    .single();

  if (linkError) {
    return NextResponse.json({ error: linkError.message }, { status: 500 });
  }

  // Step 4: Upsert tags and link_tags
  if (summary.tags.length > 0) {
    const tagNames = summary.tags.slice(0, 8).map((t) => t.toLowerCase().trim()).filter(Boolean);

    // Upsert tags (ignore conflicts)
    const { data: upsertedTags } = await supabase
      .from("tags")
      .upsert(
        tagNames.map((name) => ({ user_id: user.id, name })),
        { onConflict: "user_id,name", ignoreDuplicates: false }
      )
      .select();

    if (upsertedTags && upsertedTags.length > 0) {
      // Fetch all matching tags (upsert may not return all on conflict)
      const { data: allMatchingTags } = await supabase
        .from("tags")
        .select("id")
        .eq("user_id", user.id)
        .in("name", tagNames);

      if (allMatchingTags && allMatchingTags.length > 0) {
        await supabase.from("link_tags").insert(
          allMatchingTags.map((tag) => ({ link_id: link.id, tag_id: tag.id }))
        );
      }
    }
  }

  return NextResponse.json({ link }, { status: 201 });
}

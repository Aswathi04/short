"use client";

import { useState, useMemo } from "react";
import type { Link, Tag } from "@/types";
import AddLinkForm from "@/components/links/AddLinkForm";
import LinkCard from "@/components/links/LinkCard";
import LinkFilters from "@/components/links/LinkFilters";

interface LibraryClientProps {
  initialLinks: Link[];
  allTags: Tag[];
}

export default function LibraryClient({ initialLinks, allTags }: LibraryClientProps) {
  const [links, setLinks] = useState<Link[]>(initialLinks);
  const [tags] = useState<Tag[]>(allTags);
  const [selectedTag, setSelectedTag] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const handleLinkSaved = async () => {
    const res = await fetch("/api/links");
    if (res.ok) {
      const data = await res.json();
      setLinks(data.links);
    }
  };

  const handleDelete = (id: string) => {
    setLinks((prev) => prev.filter((l) => l.id !== id));
  };

  const filteredLinks = useMemo(() => {
    return links.filter((link) => {
      if (selectedType && link.content_type !== selectedType) return false;
      if (selectedTag && !link.tags?.some((t) => t.id === selectedTag)) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const inTitle = link.title?.toLowerCase().includes(q);
        const inSummary = link.summary?.toLowerCase().includes(q);
        if (!inTitle && !inSummary) return false;
      }
      return true;
    });
  }, [links, selectedTag, selectedType, searchQuery]);

  return (
    <div className="space-y-10">
      <AddLinkForm onSuccess={handleLinkSaved} />

      <div className="space-y-6">
        <div className="flex items-baseline justify-between border-b border-surface-border pb-3">
          <h2 className="font-serif text-xl font-medium text-ink">
            Archive Catalog
            <span className="text-xs font-sans font-normal text-ink-muted ml-2.5">
              ({filteredLinks.length} {filteredLinks.length === 1 ? "entry" : "entries"})
            </span>
          </h2>
        </div>

        <LinkFilters
          tags={tags}
          selectedTag={selectedTag}
          selectedType={selectedType}
          onTagChange={setSelectedTag}
          onTypeChange={setSelectedType}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {filteredLinks.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-surface-border rounded-lg bg-surface-card/40">
            <p className="font-serif text-3xl text-ink-muted/40 mb-2">❧</p>
            <p className="font-serif text-base text-ink-secondary">
              {links.length === 0
                ? "Your library collection is presently empty."
                : "No entries correspond to the selected filters."}
            </p>
            <p className="text-xs text-ink-muted mt-1.5 font-sans">
              {links.length === 0
                ? "Paste any article or posting URL above to begin compiling your personal digest."
                : "Try resetting your search query or topic filters."}
            </p>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {filteredLinks.map((link) => (
              <LinkCard key={link.id} link={link} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

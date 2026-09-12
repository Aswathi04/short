"use client";

import type { Tag } from "@/types";

interface LinkFiltersProps {
  tags: Tag[];
  selectedTag: string;
  selectedType: string;
  onTagChange: (tag: string) => void;
  onTypeChange: (type: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

const contentTypes: { value: string; label: string }[] = [
  { value: "", label: "All Dispatches" },
  { value: "article", label: "Articles" },
  { value: "job", label: "Job Postings" },
  { value: "other", label: "Miscellany" },
];

export default function LinkFilters({
  tags,
  selectedTag,
  selectedType,
  onTagChange,
  onTypeChange,
  searchQuery,
  onSearchChange,
}: LinkFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-3 font-sans">
      {/* Search Bar */}
      <div className="relative flex-1 min-w-48">
        <svg
          className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-muted/60"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.8}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Filter collection by title or summary keywords…"
          className="w-full bg-surface-card border border-surface-border rounded-md pl-9 pr-4 py-2 text-sm text-ink placeholder-ink-muted/60 focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent shadow-[0_1px_2px_rgba(40,36,32,0.02)] transition-colors"
        />
      </div>

      {/* Content Type Filter */}
      <select
        value={selectedType}
        onChange={(e) => onTypeChange(e.target.value)}
        className="bg-surface-card border border-surface-border rounded-md px-3 py-2 text-sm text-ink-secondary focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent shadow-[0_1px_2px_rgba(40,36,32,0.02)] cursor-pointer"
      >
        {contentTypes.map(({ value, label }) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>

      {/* Tag Filter */}
      <select
        value={selectedTag}
        onChange={(e) => onTagChange(e.target.value)}
        className="bg-surface-card border border-surface-border rounded-md px-3 py-2 text-sm text-ink-secondary focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent shadow-[0_1px_2px_rgba(40,36,32,0.02)] cursor-pointer"
      >
        <option value="">All Topics</option>
        {tags.map((tag) => (
          <option key={tag.id} value={tag.id}>
            #{tag.name}
          </option>
        ))}
      </select>

      {/* Clear Filters */}
      {(selectedTag || selectedType || searchQuery) && (
        <button
          onClick={() => {
            onTagChange("");
            onTypeChange("");
            onSearchChange("");
          }}
          className="text-xs text-ink-muted hover:text-accent transition-colors px-2 py-1.5 underline underline-offset-4 decoration-ink-muted/30 hover:decoration-accent font-medium"
        >
          Reset filters
        </button>
      )}
    </div>
  );
}

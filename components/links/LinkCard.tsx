"use client";

import { useState } from "react";
import Image from "next/image";
import type { Link } from "@/types";
import { ContentTypeBadge, TagChip } from "@/components/ui/Badge";

interface LinkCardProps {
  link: Link;
  onDelete: (id: string) => void;
}

export default function LinkCard({ link, onDelete }: LinkCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const domain = (() => {
    try {
      return new URL(link.url).hostname.replace(/^www\./, "");
    } catch {
      return link.url;
    }
  })();

  const faviconSrc =
    link.favicon_url ||
    `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Remove this entry from your collection?")) return;
    setDeleting(true);
    try {
      await fetch(`/api/links/${link.id}`, { method: "DELETE" });
      onDelete(link.id);
    } catch {
      setDeleting(false);
    }
  };

  return (
    <article
      className={`bg-surface-card border border-surface-border rounded-lg transition-all duration-200 cursor-pointer overflow-hidden ${
        expanded
          ? "ring-1 ring-accent/40 shadow-[0_4px_16px_rgba(40,36,32,0.06)]"
          : "shadow-[0_1px_3px_rgba(40,36,32,0.03)] hover:shadow-[0_2px_8px_rgba(40,36,32,0.05)] hover:border-surface-borderStrong"
      }`}
      onClick={() => setExpanded(!expanded)}
    >
      <div className="p-5 sm:p-6 flex flex-col h-full">
        {/* Header Metadata */}
        <div className="flex items-center justify-between gap-2 mb-2.5 font-sans">
          <div className="flex items-center gap-2 min-w-0">
            <div className="shrink-0 w-4 h-4 rounded-sm overflow-hidden opacity-75">
              <Image
                src={faviconSrc}
                alt=""
                width={16}
                height={16}
                className="object-contain w-4 h-4"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src =
                    `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
                }}
                unoptimized
              />
            </div>
            <span className="text-[11px] uppercase tracking-wider font-semibold text-ink-muted truncate">
              {domain}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <ContentTypeBadge type={link.content_type} />
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="p-1 text-ink-faint hover:text-accent hover:bg-accent-light/50 rounded transition-colors"
              title="Remove entry"
            >
              {deleting ? (
                <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : (
                <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Title */}
        <h3 className="font-serif text-[17px] font-semibold text-ink leading-snug line-clamp-2 mb-2.5">
          {link.title || domain}
        </h3>

        {/* Summary with reading typography */}
        {link.summary && (
          <p
            className={`font-serif text-[14.5px] text-ink-secondary leading-relaxed ${
              expanded ? "" : "line-clamp-3"
            }`}
          >
            {link.summary}
          </p>
        )}

        {/* Tag chips */}
        <div className="mt-4 pt-2 flex flex-wrap items-center gap-1.5">
          {link.tags?.map((tag) => (
            <TagChip key={tag.id} name={tag.name} />
          ))}
        </div>

        {/* Expanded View Actions */}
        {expanded && (
          <div className="mt-5 pt-4 border-t border-surface-border flex items-center justify-between font-sans">
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-accent hover:text-accent-hover underline underline-offset-4 decoration-accent/40 hover:decoration-accent transition-colors"
            >
              <span>Read Original Publication</span>
              <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
            <span className="text-[11px] text-ink-muted">
              Archived {new Date(link.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
            </span>
          </div>
        )}
      </div>
    </article>
  );
}

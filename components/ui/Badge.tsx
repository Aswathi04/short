import type { ContentType } from "@/types";

const config: Record<ContentType, { label: string; className: string }> = {
  article: {
    label: "Article",
    className: "bg-badge-sage-bg text-badge-sage-text border border-badge-sage-border",
  },
  job: {
    label: "Job Dispatch",
    className: "bg-badge-ochre-bg text-badge-ochre-text border border-badge-ochre-border",
  },
  other: {
    label: "Miscellany",
    className: "bg-badge-rose-bg text-badge-rose-text border border-badge-rose-border",
  },
};

export function ContentTypeBadge({ type }: { type: ContentType }) {
  const { label, className } = config[type] ?? config.other;
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-sm text-[11px] font-sans font-medium tracking-wide uppercase ${className}`}
    >
      {label}
    </span>
  );
}

export function TagChip({ name }: { name: string }) {
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-sans font-medium bg-badge-sand-bg text-badge-sand-text border border-badge-sand-border/80">
      #{name}
    </span>
  );
}

"use client";

import { useState } from "react";

interface AddLinkFormProps {
  onSuccess: () => void;
}

export default function AddLinkForm({ onSuccess }: AddLinkFormProps) {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to save link");
      }

      setUrl("");
      onSuccess();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-surface-card border border-surface-border rounded-lg p-6 sm:p-7 shadow-[0_1px_3px_rgba(40,36,32,0.04)]">
      <div className="mb-4">
        <h2 className="font-serif text-lg font-medium text-ink">
          Add to Collection
        </h2>
        <p className="text-xs text-ink-muted mt-0.5 font-sans">
          Paste any article, paper, or job posting URL for automated summarization.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com/article"
          required
          disabled={loading}
          className="flex-1 bg-surface-subtle border border-surface-border rounded-md px-4 py-2.5 text-sm text-ink placeholder-ink-muted/60 focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent disabled:opacity-50 font-sans transition-colors"
        />
        <button
          type="submit"
          disabled={loading || !url.trim()}
          className="bg-accent hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed text-white font-sans text-sm font-medium px-5 py-2.5 rounded-md transition-all shadow-sm whitespace-nowrap flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              <span>Reading & Summarizing…</span>
            </>
          ) : (
            "Save & Summarize"
          )}
        </button>
      </form>

      {error && (
        <div className="mt-4 flex items-start gap-2.5 bg-[#FDF6F0] border border-accent-border text-ink-primary px-4 py-3 rounded-md text-sm font-sans">
          <span className="shrink-0 text-accent font-serif">§</span>
          <div className="flex-1">
            <p className="text-xs text-[#7A3620] leading-relaxed">{error}</p>
            <button
              onClick={() => setError(null)}
              className="mt-1 text-accent hover:text-accent-hover underline text-xs font-medium"
            >
              Dismiss & retry
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

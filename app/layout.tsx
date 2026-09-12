import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Short — Personal Reading & Digest",
  description: "A thoughtful reading repository, article summaries, and task ledger.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-paper text-ink min-h-screen selection:bg-accent-light selection:text-ink">
        {children}
      </body>
    </html>
  );
}

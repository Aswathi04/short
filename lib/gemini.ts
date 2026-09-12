import type { GeminiSummaryResult } from "@/types";

const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent";

export async function summarizeContent(
  text: string
): Promise<GeminiSummaryResult> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY is not set");

  const prompt = `Analyze the following webpage content and provide a concise summary, categorize its type, and extract relevant tags.

Respond ONLY with valid JSON following this exact JSON format:
{
  "summary": "3-4 sentence concise summary of the content",
  "content_type": "article",
  "tags": ["tag1", "tag2", "tag3"]
}

Guidelines:
- content_type must be strictly one of: "article", "job", "other"
- Set content_type to "job" if it is a job posting, fellowship application, career opportunity, or hiring page
- Set content_type to "article" if it is an article, essay, paper, blog post, or guide
- Set content_type to "other" for homepages, tools, or general websites
- tags must be an array of 2 to 5 lowercase keywords (e.g. ["ai", "policy", "fellowship"])

Webpage Content:
${text.slice(0, 8000)}`;

  const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.2,
        maxOutputTokens: 2048,
        responseMimeType: "application/json",
      },
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Gemini API error ${response.status}: ${err}`);
  }

  const data = await response.json();
  const parts = data?.candidates?.[0]?.content?.parts ?? [];
  const textPart = parts.find((p: { text?: string; thought?: boolean }) => p.text && !p.thought);
  const rawText: string = textPart?.text ?? parts[0]?.text ?? "";

  // Strip potential markdown code fences
  const cleaned = rawText
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```\s*$/, "")
    .trim();

  let parsed: Partial<GeminiSummaryResult> = {};
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    const firstBrace = cleaned.indexOf("{");
    const lastBrace = cleaned.lastIndexOf("}");
    if (firstBrace !== -1 && lastBrace !== -1) {
      try {
        parsed = JSON.parse(cleaned.slice(firstBrace, lastBrace + 1));
      } catch {
        throw new Error(`Gemini returned malformed JSON: ${cleaned.slice(0, 200)}`);
      }
    } else {
      throw new Error(`Gemini returned malformed JSON: ${cleaned.slice(0, 200)}`);
    }
  }

  // Validate and sanitize
  const validTypes = ["article", "job", "other"] as const;
  const contentType = (validTypes as readonly string[]).includes(parsed.content_type ?? "")
    ? (parsed.content_type as "article" | "job" | "other")
    : "other";

  const tags = Array.isArray(parsed.tags)
    ? parsed.tags.map((t) => String(t).toLowerCase().trim()).filter(Boolean)
    : [];

  const summary = typeof parsed.summary === "string" && parsed.summary.trim()
    ? parsed.summary.trim()
    : "No summary available.";

  return {
    summary,
    content_type: contentType,
    tags,
  };
}

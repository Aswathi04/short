export type ContentType = "article" | "job" | "other";

export interface Tag {
  id: string;
  user_id: string;
  name: string;
}

export interface Link {
  id: string;
  user_id: string;
  url: string;
  title: string | null;
  summary: string | null;
  content_type: ContentType;
  favicon_url: string | null;
  created_at: string;
  tags?: Tag[];
}

export interface Todo {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  is_done: boolean;
  due_date: string | null;
  created_at: string;
}

export interface Reminder {
  id: string;
  user_id: string;
  title: string;
  remind_at: string;
  is_done: boolean;
  created_at: string;
}

export interface GeminiSummaryResult {
  summary: string;
  content_type: ContentType;
  tags: string[];
}

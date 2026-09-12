-- ============================================================
-- Short App — Initial Schema
-- Run this in the Supabase SQL Editor
-- ============================================================

-- links table
CREATE TABLE IF NOT EXISTS public.links (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  url          text NOT NULL,
  title        text,
  summary      text,
  content_type text CHECK (content_type IN ('article', 'job', 'other')) DEFAULT 'other',
  favicon_url  text,
  created_at   timestamptz DEFAULT now()
);

-- tags table
CREATE TABLE IF NOT EXISTS public.tags (
  id      uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name    text NOT NULL,
  UNIQUE (user_id, name)
);

-- link_tags join table
CREATE TABLE IF NOT EXISTS public.link_tags (
  link_id uuid NOT NULL REFERENCES public.links(id) ON DELETE CASCADE,
  tag_id  uuid NOT NULL REFERENCES public.tags(id)  ON DELETE CASCADE,
  PRIMARY KEY (link_id, tag_id)
);

-- todos table
CREATE TABLE IF NOT EXISTS public.todos (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title       text NOT NULL,
  description text,
  is_done     boolean DEFAULT false,
  due_date    date,
  created_at  timestamptz DEFAULT now()
);

-- reminders table
CREATE TABLE IF NOT EXISTS public.reminders (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title      text NOT NULL,
  remind_at  timestamptz NOT NULL,
  is_done    boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- ============================================================
-- Row Level Security
-- ============================================================

ALTER TABLE public.links     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tags      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.link_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.todos     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reminders ENABLE ROW LEVEL SECURITY;

-- links policies
CREATE POLICY "Users can view own links"   ON public.links FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own links" ON public.links FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own links" ON public.links FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own links" ON public.links FOR DELETE USING (auth.uid() = user_id);

-- tags policies
CREATE POLICY "Users can view own tags"   ON public.tags FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own tags" ON public.tags FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own tags" ON public.tags FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own tags" ON public.tags FOR DELETE USING (auth.uid() = user_id);

-- link_tags policies (join table — check via link ownership)
CREATE POLICY "Users can view own link_tags" ON public.link_tags FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.links l WHERE l.id = link_id AND l.user_id = auth.uid()));
CREATE POLICY "Users can insert own link_tags" ON public.link_tags FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM public.links l WHERE l.id = link_id AND l.user_id = auth.uid()));
CREATE POLICY "Users can delete own link_tags" ON public.link_tags FOR DELETE
  USING (EXISTS (SELECT 1 FROM public.links l WHERE l.id = link_id AND l.user_id = auth.uid()));

-- todos policies
CREATE POLICY "Users can view own todos"   ON public.todos FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own todos" ON public.todos FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own todos" ON public.todos FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own todos" ON public.todos FOR DELETE USING (auth.uid() = user_id);

-- reminders policies
CREATE POLICY "Users can view own reminders"   ON public.reminders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own reminders" ON public.reminders FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own reminders" ON public.reminders FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own reminders" ON public.reminders FOR DELETE USING (auth.uid() = user_id);

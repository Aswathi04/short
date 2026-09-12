# Short — Personal Hub

A full-stack web application for saving articles and job postings, auto-summarizing them with Google Gemini, and tracking to-dos and reminders.

**Stack**: Next.js 15 (App Router) · TypeScript · Tailwind CSS · Supabase (Auth + Postgres) · Google Gemini API · Vercel

---

## Features

- 📚 **Library** — Paste a URL, auto-extract readable text, summarize with Gemini, tag automatically
- ✅ **To-do** — Full CRUD task list with optional due dates and overdue highlighting
- 🔔 **Reminders** — Time-based reminders with in-app overdue/today/upcoming status
- 🔐 **Auth** — Email/password via Supabase Auth, all routes protected by middleware

---

## Setup

### Prerequisites
- Node.js 20+
- A [Supabase](https://supabase.com) account (free tier)
- A [Google AI Studio](https://aistudio.google.com) account for Gemini API key (free tier)
- A [Vercel](https://vercel.com) account (free tier)

---

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) → **New Project**
2. Choose a name, region, and database password
3. Once created, go to **Settings → API** and copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 2. Run Database Schema

1. In Supabase, go to **SQL Editor** → **New Query**
2. Copy the contents of [`supabase/migrations/001_initial_schema.sql`](./supabase/migrations/001_initial_schema.sql)
3. Paste and click **Run**

This creates all 5 tables (`links`, `tags`, `link_tags`, `todos`, `reminders`) with Row Level Security enabled.

### 3. Get a Gemini API Key

1. Go to [aistudio.google.com/apikey](https://aistudio.google.com/apikey)
2. Click **Create API key**
3. Copy the key → `GEMINI_API_KEY`

> The app uses `gemini-1.5-flash` which is free within generous quotas.

### 4. Configure Environment Variables

Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
GEMINI_API_KEY=your-gemini-api-key
```

### 5. Run Locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — you'll be redirected to `/login`.

---

## Deploy to Vercel

### One-click deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

### Manual steps

1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) → **New Project** → import your repo
3. In **Environment Variables**, add the same three vars from `.env.local`
4. Click **Deploy**

Vercel auto-detects Next.js — zero config needed beyond env vars.

> **Note**: If you're using Supabase Auth email confirmations, make sure to add your Vercel deployment URL to the **Supabase Auth Allowed Redirect URLs** in your Supabase project settings.

---

## Project Structure

```
short/
├── app/
│   ├── (auth)/login/        ← login page (unprotected)
│   ├── (auth)/signup/       ← signup page (unprotected)
│   ├── (app)/               ← protected layout with sidebar
│   │   ├── page.tsx         ← Library (home)
│   │   ├── todos/           ← To-do list
│   │   └── reminders/       ← Reminders
│   └── api/
│       ├── links/           ← POST save+summarize, GET list, DELETE
│       ├── todos/           ← CRUD todos
│       └── reminders/       ← CRUD reminders
├── components/
│   ├── auth/                ← LoginForm, SignupForm
│   ├── links/               ← AddLinkForm, LinkCard, LinkFilters, LibraryClient
│   ├── todos/               ← TodoItem, AddTodoForm, TodosClient
│   ├── reminders/           ← ReminderItem, AddReminderForm, RemindersClient
│   └── ui/                  ← Sidebar, Badge
├── lib/
│   ├── supabase/            ← client.ts + server.ts
│   ├── gemini.ts            ← Gemini API summarization
│   └── readability.ts       ← URL fetch + Readability extraction
├── middleware.ts             ← auth guard
└── supabase/migrations/     ← SQL schema
```

---

## Environment Variables Reference

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon/public key |
| `GEMINI_API_KEY` | Google Gemini API key (server-side only) |

---

## Tech Stack (all free tier)

| Service | Purpose | Free tier |
|---|---|---|
| [Vercel](https://vercel.com) | Hosting + serverless functions | Unlimited for personal projects |
| [Supabase](https://supabase.com) | Postgres DB + Auth | 500MB storage, unlimited auth |
| [Google Gemini](https://aistudio.google.com) | AI summarization | 15 RPM / 1M TPM free |

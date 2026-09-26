# AI-FLOW: Production Deployment Guide

## 1. Prerequisites
- Node.js 18+ (Node 20+ or 22 LTS recommended)
- Supabase Project (or self-hosted PostgreSQL with pgvector)
- Redis instance (optional for small workloads, recommended for high-volume background queue)
- LLM Provider API Key (Google Gemini API, OpenAI, or Anthropic)

---

## 2. Supabase / PostgreSQL Setup
1. Create a Supabase project at [https://supabase.com](https://supabase.com).
2. Go to **Project Settings** > **Database** and copy connection strings.
3. In SQL Editor, run `supabase/migrations/20260927000001_initial_schema.sql` (also documented in `DATABASE.md`).
4. Enable the `vector` extension:
   ```sql
   CREATE EXTENSION IF NOT EXISTS "vector";
   ```
5. Create a Storage Bucket named `documents` and set access rules according to `DATABASE.md`.

---

## 3. Environment Configuration
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
Fill in the parameters:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `AI_API_KEY` (Gemini API key or equivalent)
- `AI_PROVIDER` ("gemini")

---

## 4. Building & Running Locally
```bash
npm install
npm run build
npm run start
```
The application will launch on `http://localhost:3000`.

---

## 5. Vercel Deployment
1. Connect repository to Vercel.
2. Set Environment Variables in Project Settings.
3. Build Command: `npm run build`
4. Output Directory: `.next`
5. Deploy.

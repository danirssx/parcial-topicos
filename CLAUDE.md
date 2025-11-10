# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 16 application built with TypeScript and Tailwind CSS v4, designed as a dashboard for tracking and managing "reclamos" (complaints/claims). The application integrates with Supabase for backend data storage and is intended to work with n8n workflow automation.

## Development Commands

```bash
# Start development server (runs on http://localhost:3000)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS v4
- **Database**: Supabase (@supabase/supabase-js)
- **Charts**: Recharts (for data visualization)
- **React**: v19.2.0

## Architecture

### Directory Structure

- `app/` - Next.js App Router pages and layouts
  - `layout.tsx` - Root layout with Geist font configuration
  - `page.tsx` - Homepage
  - `globals.css` - Global styles with Tailwind directives
- `public/` - Static assets
- Environment variables are stored in `.env.local` (gitignored)

### Planned Architecture (per todo.md)

The application is designed to have:

1. **Dashboard Layout**: A sidebar navigation with main content area
2. **Supabase Integration**: Client configured to read from a `reclamos` table with fields:
   - `id`
   - `estado` (status: "pendiente" | "en_proceso" | "resuelto")
   - `created_at`
3. **Dashboard Pages**:
   - `/dashboard` - Overview with KPI cards showing total, pending, in-progress, and resolved claims
   - `/dashboard/reclamos` - Table view of all claims (planned)

### Supabase Client Pattern

The expected pattern for Supabase integration (from todo.md):
- Create a reusable client at `src/lib/supabaseClient.ts`
- Use Server Components for data fetching from Supabase
- Environment variables: `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## TypeScript Configuration

- Path alias: `@/*` maps to the root directory
- Strict mode enabled
- Target: ES2017
- JSX runtime: react-jsx (React 19 automatic runtime)

## Styling

- Uses Tailwind CSS v4 with PostCSS
- Custom fonts: Geist Sans and Geist Mono (loaded via next/font)
- Dark mode support with system-based detection

## Important Notes

- This project uses Next.js App Router (not Pages Router)
- The linter uses the new ESLint flat config format (eslint.config.mjs)
- React 19 is used with TypeScript types from @types/react v19
- Empty `.env.local` file exists but needs Supabase credentials

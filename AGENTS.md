# Frontend Agent Guide

Scope: Applies to everything under `front/`.

## Architecture & Routing
- This is a Next.js 16 App Router project. Keep new routes inside `src/app`; prefer Server Components by default and only mark files with `"use client"` if you need hooks, browser APIs, or React Query.
- Share layout chrome via `src/components/layout` (e.g., `<AppShell>`, `<AppHeader>`). Authenticated pages should wrap their children with `<ProtectedRoute>` to reuse the existing redirect logic.

## State & Data Fetching
- All API calls live in `src/lib/api-client.ts`. Extend that module instead of hand-rolling `fetch` calls so requests inherit credential handling, shared types, and the mock fallback for missing `NEXT_PUBLIC_API_BASE_URL`.
- Co-locate React Query logic inside hooks (see `src/hooks/use-dashboard-data.ts`). Use the shared `QueryClient` provided in `components/providers.tsx` and keep query keys stable.
- When adding optimistic or pending states, follow the pattern established in `ChatPanel` (temporary entries flagged with `isOptimistic`, disabled submit buttons, and graceful rollback on errors).

## Styling & Components
- Compose UI from the primitives under `src/components/ui` and utilities such as `cn` from `src/lib/utils.ts`. Tailwind tokens are defined in `src/app/globals.css`; prefer those CSS variables over raw hex values.
- Co-locate feature-specific components under `src/components/<feature>` and keep them small and stateless when possible. Share cross-cutting helpers through `src/lib`.

## TypeScript & Conventions
- Use the `@/*` path alias from `tsconfig.json` for intra-project imports—no relative traverse chains.
- Keep files typed explicitly (no `any`). If you introduce new env vars, expose them via `process.env.NEXT_PUBLIC_*` and document in `README.md`.
- Run `pnpm lint` in this folder before handing off significant changes.

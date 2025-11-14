## HavenMind Frontend

HavenMind is an AI-powered home maintenance co-pilot that keeps every property organized, maintained, and worry-free. This repo contains the public marketing page, onboarding flows, and the authenticated dashboard that surfaces the Home Journal, maintenance plans, and collaboration tools.

### What this build showcases

- **Smart document intake** – Upload inspection reports, receipts, or manuals and HavenMind automatically extracts systems, warranty terms, and service dates.
- **Proactive maintenance plans** – AI builds task schedules, reminders, and a Home Health Score so issues are fixed before they become emergencies.
- **Collaboration hub** – Coordinate with service professionals, assign jobs, and keep a transparent, searchable history of every repair.
- **Chat-first assistance** – Ask the HavenMind copilot for prep checklists, vendor recommendations, or a recap of recent work.

## Quick start

```bash
pnpm install
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000) for the marketing page, `/signup` or `/login` for onboarding, and `/dashboard` for the protected HavenMind experience.

## Backend integration

Authentication and APIs live on your backend. Point `NEXT_PUBLIC_AUTH_BASE_URL` to the service that exposes your Better Auth router (usually the same origin that powers the HavenMind API) and make sure it is reachable from the browser. Login and signup talk directly to that backend, which issues secure HTTP-only cookies.

## Environment variables

Create a `.env.local` from the provided example.

| Variable | Description |
| --- | --- |
| `NEXT_PUBLIC_APP_URL` | Public site URL for this frontend (used in marketing copy/fallbacks). |
| `NEXT_PUBLIC_AUTH_BASE_URL` | Origin of the backend that runs authentication for HavenMind (e.g., `http://localhost:4000`). |
| `NEXT_PUBLIC_AUTH_BASE_PATH` | Path segment for the auth route on the backend (defaults to `/api/auth`). |
| `NEXT_PUBLIC_API_BASE_URL` | Base URL for the HavenMind API. When unset, the dashboard/chat use mocked property data. Requests include cookies, so enable CORS with credentials if origins differ. |

Run the dev server with `pnpm dev`. The frontend shares the secure session cookie with every fetch call so your API recognizes the signed-in homeowner or operator.

## Architecture notes

- `src/lib/auth/client.ts` configures the Better Auth client that powers HavenMind login, signup, and session hooks.
- `src/lib/api-client.ts` centralizes backend calls. When `NEXT_PUBLIC_API_BASE_URL` is present the helper sends authenticated requests and reuses the user’s session cookie.
- React Query (`src/components/providers.tsx`) caches dashboard data and chat transcripts for a snappy UX.
- UI primitives live in `src/components/ui/*`, while feature components (auth, dashboard, chat, layout) sit under `src/components`.

## Available scripts

| Script | Description |
| --- | --- |
| `pnpm dev` | Start the Next.js dev server |
| `pnpm build` | Create a production build |
| `pnpm start` | Run the built app |
| `pnpm lint` | Run ESLint |

## Next steps

- Swap the mock data with your real maintenance APIs by setting `NEXT_PUBLIC_API_BASE_URL`.
- Extend the dashboard cards to show asset-level schedules, invoices, or tenant requests.
- Stream chat responses from your AI service so the HavenMind copilot can summarize repairs in real time.

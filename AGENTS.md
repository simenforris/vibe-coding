# Repository Guidelines

## Project Structure & Module Organization
- Source: `src/app` (App Router). Pages live in route segments (e.g., `src/app/character/page.tsx`).
- Global styles: `src/app/globals.css`. Public assets: `public/`.
- Configuration: `next.config.ts`, `eslint.config.mjs`, `tsconfig.json`, `.prettierrc`.
- Imports: use `@/*` path alias for `src/*`.
- Co-locate UI with routes (e.g., `src/app/profile/components/UserCard.tsx`).

## Build, Test, and Development Commands
- Install deps: `bun install` (preferred) or `npm i`.
- Dev server: `bun run dev` or `npm run dev` — Next dev with Turbopack.
- Build: `bun run build` — production bundle in `.next/`.
- Start: `bun run start` — serve the built app.
- Lint: `bun run lint` — ESLint with Next/TS rules.
- Format: `bun run format` — Prettier + Tailwind plugin.

## Coding Style & Naming Conventions
- TypeScript strict; 2-space indent; width 100; semicolons; single quotes (see `.prettierrc`).
- Components: PascalCase (`UserCard.tsx`). Hooks/utils: camelCase. Route segments: kebab-case.
- Prefer Server Components; add `"use client"` only when required.
- Use `@/` alias; avoid long relative import chains.

## Testing Guidelines
- Framework: Vitest only.
- Naming: co-locate tests as `*.test.ts` or `*.test.tsx` next to source.
- Run: `bun run test` or `npm test` (single command runs Vitest).
- Tips: For component tests, add a `jsdom` environment later if needed.

## Commit & Pull Request Guidelines
- Commits: short, imperative; optional types/scopes, e.g., `feat: add character route`, `chore: update ESLint` (see history).
- PRs: clear description, screenshots for UI changes, linked issues, and notes on accessibility/perf when relevant.
- Keep PRs focused; ensure `lint` and `format` pass and the app builds (`bun run build`).

## Architecture & Config Tips
- Next.js App Router (React 19). Tailwind v4 via PostCSS; fonts configured in `src/app/layout.tsx`.
- Client-exposed env vars must start with `NEXT_PUBLIC_`. Keep secrets in `.env.local` (never committed).

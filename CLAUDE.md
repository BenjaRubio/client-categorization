# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

- `npm run dev` — start dev server
- `npm run build` — production build
- `npm run lint` — run ESLint
- `npx prisma db seed` — seed database (runs `tsx src/db/seed.ts`)
- `npx prisma migrate dev` — create/apply migrations
- `npx prisma generate` — regenerate Prisma client after schema changes

## Architecture

Next.js 16 App Router project (React 19) for categorizing clients using LLM providers. Uses PostgreSQL via Prisma, CSS Modules for styling, and a provider-agnostic LLM service layer.

### Key Conventions

- **Page co-location**: Every page directory has `_components/`, `_fetchers/` (server-only reads), and `_actions/` (server actions for writes). See `.claude/skills/file-structure/SKILL.md` for the full convention.
- **Services layer** (`src/services/`): Business logic decoupled from Next.js. Never imported directly from page components — accessed through `_fetchers` and `_actions`.
- **LLM registry** (`src/services/llm/`): Multi-provider system with automatic fallback. Providers registered in `registry.ts` (OpenAI -> Anthropic -> Groq). Add new providers by implementing `LLMProvider` interface in `providers/`.
- **DB singleton** (`src/db/prisma.ts`): Uses `globalThis` pattern to prevent hot-reload connection exhaustion.
- **UI components** (`src/ui/`): Atomic reusable elements with barrel export. Import via `@/ui` or `@/ui/ComponentName`.
- **Styling**: Vanilla CSS Modules (no Tailwind). Design tokens in `src/styles/tokens.css`, base styles in `src/styles/base.css`.
- **Import alias**: All imports use `@/*` mapped to `./src/*`.
- **Forms**: Live as components inside the `_components/` folder of their page, not in a separate forms directory. Use react-hook-form + zod for validation.

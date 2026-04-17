---
name: file-structure
description: File structure conventions for the Next.js client-categorization app. Use this skill whenever creating new files, pages, components, fetchers, actions, services, or database-related code. Also use when deciding where to place a new feature, utility, or type definition. Ensures consistent project organization with the _components/_fetchers/_actions convention per page, separated services layer, and proper import aliases.
---

# File Structure Conventions

This skill defines folder structure and naming conventions for the client-categorization Next.js project. All source code lives under `src/`.

## Naming Conventions

All files use **kebab-case**:

- Components: `meetings-table.tsx`, `classify-button.tsx`, `pie-chart.tsx`
- Fetchers: `get-meetings.fetcher.ts`, `get-filter-options.fetcher.ts`
- Actions: `classify-meeting.action.ts`, `create-meeting.action.ts`
- UI atoms: `button.tsx`, `table.tsx`, `select.tsx`
- CSS Modules: `button.module.css`, `table.module.css`
- Services: `seed.service.ts`, `classify-meeting.ts`
- Repositories: `client.repository.ts`, `sales-meeting.repository.ts`

`page.tsx` and `layout.tsx` are **always server components**. All client interactivity lives in `_components/`.

## Top-Level Layout

```
src/
├── app/          # Next.js App Router — pages, layouts, co-located page logic
├── services/     # Business logic decoupled from Next.js (seeding, LLM, etc.)
├── db/           # Database: Prisma client, schema, migrations, repositories, seed data
├── ui/           # Atomic reusable UI elements (Button, Card, Input, etc.)
└── types/        # Shared TypeScript interfaces and types
```

The Prisma schema lives at `src/db/prisma/schema.prisma` (configured via `prisma.schema` in `package.json`).

## `/app` — Page Co-location Pattern

Every folder that contains a `page.tsx` MUST also have these **private folders** (prefixed with `_`):

| Folder | What goes here | Execution context |
|---|---|---|
| `_components/` | UI components for this page | Client or Server |
| `_fetchers/` | Functions that **read** from DB | Server-only |
| `_actions/` | Functions that **write/delete** to DB (Server Actions) | Server-only (`"use server"`) |

### How they connect

- `_fetchers/` are called inside Server Components (the page or its server children) to load data before rendering.
- `_actions/` use the `"use server"` directive and are invoked from client components via form actions or `useTransition`.
- `_components/` holds page-specific components. When a component is reused across multiple pages, promote it to `/ui`.
- **Forms** live as components inside the `_components/` folder of the page that needs them — there is no dedicated forms page.

### Example

```
app/
├── layout.tsx                    # Root layout with Navbar (server component)
├── page.tsx                      # Home page (server component)
├── globals.css
├── ventas/
│   ├── page.tsx                  # Server component — fetches then renders _components
│   ├── _components/
│   │   ├── meetings-table.tsx
│   │   └── classify-button.tsx
│   ├── _fetchers/
│   │   ├── get-meetings.fetcher.ts
│   │   └── get-filter-options.fetcher.ts
│   └── _actions/
│       └── classify-meeting.action.ts
├── metricas/
│   ├── page.tsx
│   ├── _components/
│   │   ├── metrics-dashboard.tsx
│   │   └── salesmen-bar-chart.tsx
│   └── _fetchers/
│       └── get-metrics-data.fetcher.ts
```

## `/services` — Business Logic

Services contain domain logic with no Next.js dependency. They are imported by `_fetchers`, `_actions`, or other services — never directly from page components.

```
services/
├── seed.service.ts
└── llm/
    ├── index.ts              # Public API (re-exports main functions)
    ├── types.ts              # LLMProvider interface, request/response types
    ├── registry.ts           # Provider registry + fallback orchestrator
    └── providers/
        ├── openai.provider.ts
        └── groq.provider.ts
```

To add a new LLM provider: create a file in `providers/`, implement `LLMProvider`, register it in `registry.ts`.

## `/db` — Database

```
db/
├── prisma-client.ts      # Prisma client singleton (globalThis guard for dev)
├── seed.ts               # Seed script (run via `npx prisma db seed`)
├── data/                 # Static data files (CSVs for seeding)
│   └── vambe_clients.csv
├── prisma/               # Prisma schema + migrations
│   ├── schema.prisma
│   └── migrations/
└── repositories/         # Data-access layer (one file per entity)
    ├── index.ts
    ├── client.repository.ts
    ├── salesman.repository.ts
    ├── sales-meeting.repository.ts
    └── meeting-category.repository.ts
```

## `/ui` — Atomic UI Components

Design-system-level, reusable elements. Import via `@/ui` barrel — never relative paths like `../../../ui`.

```
ui/
├── styles/               # Component-specific CSS Modules
│   ├── button.module.css
│   ├── card.module.css
│   ├── table.module.css
│   └── ...
├── button.tsx
├── card.tsx
├── table.tsx
├── select.tsx
├── checkbox.tsx
├── input.tsx
├── text-area.tsx
├── badge.tsx
├── pie-chart.tsx         # "use client" — recharts wrapper
├── bar-chart.tsx         # "use client" — recharts wrapper
├── scatter-chart.tsx     # "use client" — recharts wrapper
├── index.ts              # Barrel export
```

## Styling & Modularity

The project uses modular Vanilla CSS to ensure performance and prevent design bloat:

- **Tokens (`src/styles/tokens.css`)**: Global design variables (colors, spacing, fonts). The **Single Source of Truth** for the theme.
- **Base (`src/styles/base.css`)**: Resets, global typography, and shared utilities (e.g., glassmorphism, gradients).
- **CSS Modules (`*.module.css`)**: Used for every page and component to ensure local scoping and prevent naming collisions.
  - Page-specific styles live next to the page/layout file (e.g., `dashboard.module.css`).
  - UI component styles live in `ui/styles/`.

### Why this structure?
- **modularity**: Styles are scoped to where they are used.
- **performance**: CSS is code-split by Next.js automatically.
- **maintainability**: No "cascading" side-effects. Changing a button's padding won't break a card.

## `/types` — Shared Interfaces

Use `interface` (not `type`) when definitions become syntactically complex.

```
types/
├── index.ts
├── database.ts
└── llm.ts
```

## Import Aliases

`tsconfig.json` path aliases — all imports use `@/` prefix:

```json
{
  "paths": {
    "@/*": ["./src/*"]
  }
}
```

Usage: `import { Button, Table, PieChart } from "@/ui"`, `import prisma from "@/db/prisma-client"`, `import { callLLM } from "@/services/llm"`.

## `/lib` — Shared Utilities

```
lib/
└── enum-labels.ts        # Spanish display labels for all Prisma enums
```

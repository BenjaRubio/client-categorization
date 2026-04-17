## Client Categorization

Next.js + Prisma app for client categorization and sales metrics.

## Getting Started

### 1) Start local Postgres (Docker)

```bash
docker compose up -d
```

### 2) Configure local env

```bash
cp .env.example .env.local
```

### 3) Apply migrations and run the app

```bash
npm run prisma:migrate:dev
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environments: local vs production

Prisma reads these vars from `src/db/prisma/schema.prisma`:

- `DATABASE_URL`: runtime queries (used by the app)
- `DIRECT_URL`: direct connection for Prisma migrations

### Local (Docker Postgres)

Use `.env.local` with local values:

- `DATABASE_URL=postgresql://dev:dev@localhost:5432/client_categorization?schema=public`
- `DIRECT_URL=postgresql://dev:dev@localhost:5432/client_categorization?schema=public`

> Note: Next.js reads `.env.local` automatically.
> Prisma CLI does not read `.env.local` by default, so `prisma:migrate:dev` uses
> `dotenv -e .env.local -- prisma migrate dev`.

### Production (Vercel + Supabase)

Set env vars in **Vercel Project Settings -> Environment Variables** (see `.env.production.example`):

- `DATABASE_URL`: Supabase **pooler** URL (`:6543`, `pgbouncer=true`)
- `DIRECT_URL`: Supabase **direct** URL (`:5432`) for migrations

## Vercel deploy with Prisma migrations

Set Vercel build command to:

```bash
npm run vercel-build
```

This will:

1. Generate Prisma Client
2. Run `prisma migrate deploy` against `DIRECT_URL`
3. Run `seed:if-empty` (bootstrap CSV seed only when the database has no clients)
4. Build Next.js

Configure LLM keys in Vercel if you use classification from the app or run `classify:pendings` manually.

## Useful scripts

- `npm run prisma:generate`
- `npm run prisma:migrate:dev`
- `npm run prisma:migrate:deploy`
- `npm run prisma:seed`
- `npm run seed:if-empty`
- `npm run classify:pendings` (classifies unclassified meetings; run locally or from your own automation)

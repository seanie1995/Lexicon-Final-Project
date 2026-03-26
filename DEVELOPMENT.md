# Development Guide

## Prerequisites

- Node.js (LTS recommended)
- npm (comes with Node.js)

## Project Structure

This is an **npm workspaces** monorepo:

```
apps/
  webshop/      — Customer-facing Next.js storefront
  admin/        — Admin panel (Next.js)
packages/
  db/           — Prisma schema + database client
  shared-types/ — Shared Zod schemas and types
  ui/           — Shared UI components
```

## Getting Started

### 1. Install dependencies

From the **project root**:

```bash
npm install
```

This installs all dependencies across every workspace package.

### 2. Start the webshop

From the **project root**:

```bash
npm run webshop
```

This runs `next dev` inside `apps/webshop`. The app will be available at [http://localhost:3000](http://localhost:3000).

### 3. Start the admin panel

```bash
npm run admin
```

The admin app defaults to [http://localhost:3001](http://localhost:3001) when the webshop is already running on 3000.

## Available Scripts (root)

| Command           | Description                         |
| ----------------- | ----------------------------------- |
| `npm run webshop` | Start the webshop dev server        |
| `npm run admin`   | Start the admin dev server          |
| `npm run lint`    | Run Biome linter on the entire repo |
| `npm run format`  | Format all files with Biome         |

## Workspace-Specific Scripts

You can also run scripts directly inside a workspace:

```bash
# Build the webshop for production
npm run build -w apps/webshop

# Start the webshop in production mode (after building)
npm run start -w apps/webshop
```

## Linting & Formatting

The project uses [Biome](https://biomejs.dev/) for linting and formatting.

```bash
npm run lint      # Check for issues
npm run format    # Auto-format all files
```

## Prisma (Database)

The project uses [Prisma](https://www.prisma.io/) as the ORM with a Supabase PostgreSQL database.

### Prisma Commands

| Command                  | Description                                                                                                                            |
| ------------------------ | -------------------------------------------------------------------------------------------------------------------------------------- |
| `npx prisma generate`    | Generates the Prisma Client from your schema. Run this after changing `schema.prisma`. The client provides type-safe database queries. |
| `npx prisma db push`     | Pushes your schema changes to the database without creating a migration file. Good for prototyping.                                    |
| `npx prisma db pull`     | Pulls the current database schema and updates `schema.prisma` to match it. Useful when the database was changed outside of Prisma.     |
| `npx prisma db seed`     | Runs the seed script (`prisma/seed.ts`) to populate the database with initial data.                                                    |
| `npx prisma migrate dev` | Creates a new migration from schema changes and applies it. Use this for production-ready migrations.                                  |
| `npx prisma studio`      | Opens a web UI to browse and edit your database data.                                                                                  |

### Typical Workflow

1. Edit `apps/webshop/prisma/schema.prisma`
2. Run `npx prisma generate` to update the client types
3. Run `npx prisma db push` (prototyping) or `npx prisma migrate dev` (production) to apply changes
4. Run `npx prisma db seed` to populate test data

### Supabase AUTH Keys

Two special keys are needed to get supabase auth to function. These are:

NEXT_PUBLIC_SUPABASE_URL=[key]
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=[key]

Create a .env.local file in the apps/webshop directory. You will find the keys in the Supabase project dasboard that you access via the browser.

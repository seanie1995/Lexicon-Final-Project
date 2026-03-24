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

| Command | Description |
|---------|-------------|
| `npm run webshop` | Start the webshop dev server |
| `npm run admin` | Start the admin dev server |
| `npm run lint` | Run Biome linter on the entire repo |
| `npm run format` | Format all files with Biome |

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

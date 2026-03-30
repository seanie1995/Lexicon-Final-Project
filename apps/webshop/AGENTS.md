# Lexicon Webshop - AI Agent Guide

This file provides a quick architectural overview and technical details for AI agents working on the `apps/webshop` application.

## 🚀 Overview
The Webshop is a core part of the Lexicon project, built as a modern, high-performance literature e-commerce platform using Next.js.

## 🛠 Tech Stack
-   **Framework**: Next.js 16.x (App Router)
-   **Styling**: Tailwind CSS
-   **Database**: PostgreSQL
-   **ORM**: Prisma
-   **Auth**: Supabase Auth (`@supabase/ssr`)
-   **Payments**: Stripe
-   **Linting**: Biome

## 📂 Project Structure
```text
apps/webshop/
├── prisma/               # Prisma schema and seed scripts
├── public/               # Static assets
└── src/
    ├── app/              # Next.js App Router (Routes & Pages)
    │   ├── api/          # API Route handlers
    │   ├── catalog/      # Product listing pages
    │   ├── checkout/     # Checkout flow
    │   ├── product/      # Product details
    │   └── ...           # Auth (login/register), account pages
    ├── components/       # UI Components (shared & page-specific)
    └── lib/              # Core logic and shared utilities
        ├── actions/      # Next.js Server Actions
        ├── contexts/     # Client-side React Context (e.g., Cart)
        └── prisma.ts     # Global Prisma client instance
```

## 🏗 Key Components & Patterns
-   **Cart Management**: Uses `CartProvider` (`src/lib/contexts/cart-context.tsx`) to manage shopping cart state across the app.
-   **Server Components**: Preferred for data fetching (e.g., `src/app/catalog/page.tsx`).
-   **Server Actions**: Used for mutations and form handling (e.g., `src/lib/actions/`).
-   **Auth Layout**: Shared layout for authentication-related pages (`src/components/auth-layout.tsx`).
-   **Stripe Integration**: Client-side Stripe elements used in `src/app/checkout/`.

## 🗄 Core Data Models (Prisma)
-   `Product`: The central entity, linked to `Category`, `Author`, `Publisher`, and `Condition`.
-   `Category`: Hierarchical product categorization.
-   `Author`: Metadata about book authors.
-   `Publisher`: Metadata about book publishers.
-   `Condition`: Details about the physical state of the literature.

## 📋 Environment Variables
Ensure the following are set in `.env.local`:
-   `DATABASE_URL`: PostgreSQL connection string.
-   `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase configuration.
-   `STRIPE_SECRET_KEY` / `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`: Stripe configuration.

## 🤝 Rules for Agents
-   **Styling**: Use Tailwind CSS utility classes. Prioritize rich aesthetics as per Lexicon design principles.
-   **Performance**: Use Server Components where possible; keep client-side state minimal.
-   **Typing**: All new code must be fully typed with TypeScript.
-   **Formatting**: Use Biome (`npm run lint`).

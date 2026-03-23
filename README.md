# Lexicon-Final-Project

## Grupp 3 plan

* Supabase för datalager / produkter / mm
* Supabase för authentisering?
* Prisma som ORM för att enkelt kunna hantera data (prisma.get...)
* Next.js GET/POST API routes för webshops API mm, "som vanligt"

## Planering av funktioner

- 🔐 Autentisering: Implementera inloggning för kunder via Supabase.
- ☁️ Database: Supabase + ORM som Prisma
- 📦 Varukorg: Hantera varukorgen med persistens via cookies/databas eller globala state via Zustand (alt useContext).
- 💳 Betallösning: Integrera ett testläge för Stripe för att simulera ett riktigt köp.
- 🎨 UI-Library: Bygg ett enhetligt och professionellt UI med Tailwind. Wireframe / Skiss via Stitch eller Lovable/v0/liknande.
- 🌍 Deployment: Driftsätt applikationen på Vercel el. Netlify

### Jättefrivilligt (Jim tycker detta låter skoj)
- 〽️ Optimering: Lägg in suspense på strömmande delar och se till att cachning fungerar optimalt (ev använd cache components). Implementera useTransition/startTransition och useOptimistic för UI-uppdateringar.
- ⚙️ Testning: Implementera E2E-testning via Playwright/Cypress och/eller unit testning med Jest/Vitest
- 

### Jim frivillig att
- Refaktorering: Eftersom vi bygger vidare på gammal kod – fixa till så admin-gränssnittet fungerar med nya kodbas/databas om ca 1-2v efter projektstart så det blir bra!


```
Lexicon-Final-Project/ (monorepo)
├── apps/
│   ├── webshop/                      ← din kund-facing Next.js app
│   │   ├── src/                      ← rekommenderat: allt källkod i src/
│   │   │   ├── app/                  ← App Router – definierar routes & API:er
│   │   │   │   ├── api/              ← Route Handlers = API endpoints
│   │   │   │   │   ├── products/
│   │   │   │   │   │   ├── route.ts           →  GET /api/products
│   │   │   │   │   │   └── [id]/
│   │   │   │   │   │       └── route.ts       →  GET/PATCH/DELETE /api/products/:id
│   │   │   │   │   ├── cart/
│   │   │   │   │   │   └── route.ts
│   │   │   │   │   ├── checkout/
│   │   │   │   │   │   └── route.ts
│   │   │   │   │   └── auth/...
│   │   │   │   │
│   │   │   │   ├── (shop)/
│   │   │   │   │   ├── layout.tsx             ← t.ex. med produktnav & kundvagn
│   │   │   │   │   ├── page.tsx               →  / (eller /shop om du vill)
│   │   │   │   │   ├── products/
│   │   │   │   │   │   ├── page.tsx           →  /products
│   │   │   │   │   │   ├── [slug]/
│   │   │   │   │   │   │   ├── page.tsx       →  /products/t-shirt
│   │   │   │   │   │   │   └── loading.tsx
│   │   │   │   │   └── categories/
│   │   │   │   │       └── [category]/
│   │   │   │   │           └── page.tsx
│   │   │   │   ├── layout.tsx                ← root layout (html, body, providers)
│   │   │   │   ├── page.tsx                  ← fallback / 404-liknande
│   │   │   │   ├── globals.css               ← eller tailwind/global styles
│   │   │   │   ├── favicon.ico
│   │   │   │   └── robots.txt
│   │   │   │
│   │   │   ├── lib/                          ← libs for like actions.ts and stuff.
│   │   │   │   ├── db.ts
│   │   │   │   └── actions.ts
│   │   │   ├── components/                   ← återanvändbara UI-komponenter
│   │   │   │   ├── ui/                       ← shadcn/ui, Radix, eller egna primitiver
│   │   │   │   │   ├── button.tsx
│   │   │   │   │   ├── card.tsx
│   │   │   │   │   └── ...
│   │   │   │   ├── layout/                   ← stora layout-delar
│   │   │   │   │   ├── Navbar.tsx
│   │   │   │   │   ├── Footer.tsx
│   │   │   │   │   └── SidebarCart.tsx
│   │   │   │   └── feature/                  ← feature-specifika komponenter (valfritt)
│   │   │
│   │   ├── public/                           ← statiska filer
│   │   │   ├── images/
│   │   │   └── fonts/
│   │   │
│   │   ├── next.config.mjs / .ts
│   │   ├── tsconfig.json
│   │   ├── tailwind.config.ts
│   │   ├── postcss.config.js
│   │   └── package.json
│   │ 
├── packages/
│   ├── shared-types/                         ← gemensamma zod-schemas, db-typer etc.
│   ├── ui/                                   ← gemensamma komponenter (valfritt senare)
│   └── db/                                   ← prisma schema + client (valfritt monorepo-paket)
│
├── package.json
└── .gitignore

```

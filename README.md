# Lexicon-Final-Project

Grupp 3 plan

* Supabase för datalager / produkter / mm
* Supabase för authentisering?
* Prisma som ORM för att enkelt kunna hantera data (prisma.get...)
* Next.js GET/POST API routes för webshops API mm, "som vanligt"
* 

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

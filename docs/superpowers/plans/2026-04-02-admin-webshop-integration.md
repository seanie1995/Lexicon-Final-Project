# Admin → Webshop Database Integration — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate the admin interface from json-server to use the webshop's Prisma/PostgreSQL database via a shared `packages/db` package, enabling full Product CRUD and Order management.

**Architecture:** Move Prisma schema into `packages/db`, export Prisma client + types. Admin imports `@repo/db` and uses server actions with Prisma directly. Product forms match the webshop's schema. New Orders section added.

**Tech Stack:** Next.js 16, Prisma 7, PostgreSQL, Supabase, Tailwind CSS, TypeScript

---

## File Map

### New files
| File | Purpose |
|------|---------|
| `packages/db/package.json` | Shared DB package config |
| `packages/db/tsconfig.json` | TypeScript config for db package |
| `packages/db/src/index.ts` | Exports Prisma client + re-exports Prisma types |
| `apps/admin/lib/actions/products.ts` | Product CRUD server actions (Prisma) |
| `apps/admin/lib/actions/orders.ts` | Order read + status update server actions |
| `apps/admin/app/orders/page.tsx` | Orders list page |
| `apps/admin/app/orders/[id]/page.tsx` | Order detail page |
| `apps/admin/components/order-table/order-table.tsx` | Order list table |
| `apps/admin/components/order-table/order-table-row.tsx` | Order table row |
| `apps/admin/components/order-detail/order-detail.tsx` | Order detail view |
| `apps/admin/components/order-detail/status-badge.tsx` | Order status badge |

### Modified files
| File | Change |
|------|--------|
| `packages/db/package.json` | Add `@prisma/client`, `prisma`, exports config |
| `packages/db/src/index.ts` | New — exports prisma + types |
| `apps/webshop/package.json` | Remove `@prisma/client`, `prisma`; add `@repo/db` |
| `apps/webshop/prisma.config.ts` | Update schema path to `../../packages/db/prisma/schema.prisma` |
| `apps/webshop/src/lib/prisma.ts` | Import from `@repo/db` instead of `@prisma/client` |
| `apps/admin/package.json` | Add `@repo/db`, `@prisma/client` |
| `apps/admin/lib/types/product.ts` | Replace with Prisma type re-exports |
| `apps/admin/lib/types/index.ts` | Export new types |
| `apps/admin/components/form/add-product-form.tsx` | Full rewrite to match Prisma schema |
| `apps/admin/components/form/edit-product-form.tsx` | Full rewrite to match Prisma schema |
| `apps/admin/components/form/product-filter-form.tsx` | Minor: remove json-server query format |
| `apps/admin/components/product-table/product-table.tsx` | Updated columns |
| `apps/admin/components/product-table/product-table-row.tsx` | Updated columns + data shape |
| `apps/admin/app/page.tsx` | Use new Prisma actions instead of json-server fetch |
| `apps/admin/app/products/add/page.tsx` | Pass lookup data to form |
| `apps/admin/app/products/edit/[id]/page.tsx` | Use new getProductById |
| `apps/admin/components/sidebar/sidebar-nav.tsx` | Add Orders nav item |

### Deleted files
| File | Reason |
|------|--------|
| `apps/admin/lib/actions.ts` | Replaced by `actions/products.ts` |
| `apps/webshop/prisma/schema.prisma` | Moved to `packages/db/prisma/` |
| `apps/webshop/prisma/seed.ts` | Moved to `packages/db/prisma/` |
| `apps/webshop/prisma/bookSeedData.ts` | Moved to `packages/db/prisma/` |

---

## Task 1: Set up `packages/db` — Shared Prisma Package

**Goal:** Move Prisma schema into `packages/db` and export the client + types.

- [ ] **Step 1: Create `packages/db/package.json`**

```json
{
  "name": "@repo/db",
  "version": "0.1.0",
  "private": true,
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "exports": {
    ".": {
      "types": "./src/index.ts",
      "default": "./src/index.ts"
    },
    "./prisma/*": "./prisma/*"
  },
  "dependencies": {
    "@prisma/client": "^7.5.0"
  },
  "devDependencies": {
    "prisma": "^7.5.0",
    "typescript": "^5.9.3"
  },
  "scripts": {
    "db:generate": "npx prisma generate",
    "db:push": "npx prisma db push",
    "db:migrate": "npx prisma migrate dev",
    "db:seed": "npx tsx prisma/seed.ts",
    "db:studio": "npx prisma studio"
  }
}
```

- [ ] **Step 2: Create `packages/db/tsconfig.json`**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "declaration": true,
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "outDir": "./dist"
  },
  "include": ["src/**/*"]
}
```

- [ ] **Step 3: Move `apps/webshop/prisma/` to `packages/db/prisma/`**

Run:
```bash
mv apps/webshop/prisma packages/db/prisma
```

- [ ] **Step 4: Create `packages/db/src/index.ts`**

```ts
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient() {
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

// Re-export Prisma types for consumers
export type { Prisma } from "@prisma/client";
export { PrismaClient } from "@prisma/client";
```

- [ ] **Step 5: Update `packages/db/prisma/seed.ts` imports**

The seed file currently imports from `@prisma/client` and `@prisma/adapter-pg` directly. Update it to use the same pattern but keep it self-contained (seed scripts run standalone):

```ts
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { authors, categories, conditions, products, publishers } from "./bookSeedData";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

// ... rest of seed.ts stays the same
```

No change needed — seed files don't import from the package index.

- [ ] **Step 6: Commit**

```bash
git add packages/db/
git commit -m "feat: add shared @repo/db package with Prisma schema and client"
```

---

## Task 2: Update `apps/webshop` to Import from `@repo/db`

**Goal:** Webshop uses the shared package instead of local Prisma.

- [ ] **Step 1: Update `apps/webshop/package.json`**

Remove these dependencies:
```diff
  "dependencies": {
-   "@prisma/adapter-pg": "^7.5.0",
-   "@prisma/client": "^7.5.0",
+   "@repo/db": "*",
```

Remove from devDependencies:
```diff
  "devDependencies": {
-   "prisma": "^7.5.0",
```

- [ ] **Step 2: Replace `apps/webshop/src/lib/prisma.ts`**

```ts
export { prisma } from "@repo/db";
```

- [ ] **Step 3: Update `apps/webshop/prisma.config.ts`**

```ts
import { defineConfig } from "prisma/config";

export default defineConfig({
  earlyAccess: true,
  schema: "../../packages/db/prisma/schema.prisma",
});
```

- [ ] **Step 4: Verify webshop still compiles**

Run:
```bash
npm install
npm run build -w apps/webshop
```

Expected: Build succeeds with no Prisma-related errors.

- [ ] **Step 5: Commit**

```bash
git add apps/webshop/
git commit -m "refactor: webshop imports Prisma from @repo/db"
```

---

## Task 3: Wire Up `apps/admin` to `@repo/db`

**Goal:** Admin can access the Prisma client and database.

- [ ] **Step 1: Update `apps/admin/package.json`**

Add dependencies:
```diff
  "dependencies": {
+   "@repo/db": "*",
    "lucide-react": "^1.1.0",
```

- [ ] **Step 2: Create `apps/admin/.env.local`**

```env
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres
```

Use the same `DATABASE_URL` from `apps/webshop/.env`.

- [ ] **Step 3: Update `apps/admin/lib/types/product.ts`**

Replace the entire file:

```ts
import type { Prisma } from "@prisma/client";

export type ProductWithRelations = Prisma.ProductGetPayload<{
  include: {
    category: true;
    condition: true;
    author: true;
    publisher: true;
  };
}>;

export type Category = { id: number; name: string };
export type Condition = {
  id: number;
  exterior: string;
  interior: string;
  grade: string;
};
export type Author = { id: number; name: string; description: string };
export type Publisher = { id: number; name: string; description: string };

export interface PaginatedProducts {
  data: ProductWithRelations[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export type OrderStatus = "PENDING" | "PAID" | "SHIPPED" | "DELIVERED" | "CANCELLED";

export type OrderWithItems = Prisma.OrderGetPayload<{
  include: { items: true };
}>;
```

- [ ] **Step 4: Update `apps/admin/lib/types/index.ts`**

```ts
import type { NavItem } from "./sidebar";

export type { NavItem };
export type {
  ProductWithRelations,
  Category,
  Condition,
  Author,
  Publisher,
  PaginatedProducts,
  OrderStatus,
  OrderWithItems,
} from "./product";
```

- [ ] **Step 5: Commit**

```bash
git add apps/admin/package.json apps/admin/.env.local apps/admin/lib/types/
git commit -m "feat: wire admin app to @repo/db and update types"
```

---

## Task 4: Write Product Server Actions

**Goal:** Replace json-server fetches with Prisma queries.

- [ ] **Step 1: Delete `apps/admin/lib/actions.ts`**

This file contains the old json-server fetches (`deleteProductAPI`, `addProductAPI`, `updateProductAPI`). Delete it entirely.

- [ ] **Step 2: Create `apps/admin/lib/actions/products.ts`**

```ts
"use server";

import { prisma } from "@repo/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { PaginatedProducts } from "@/lib/types/product";

const productInclude = {
  category: true,
  condition: true,
  author: true,
  publisher: true,
} as const;

export async function getProducts(
  page = 1,
  pageSize = 6,
  search = "",
  categoryId?: number,
  availabilityStatus?: string,
): Promise<PaginatedProducts> {
  const where: Record<string, unknown> = {};

  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ];
  }

  if (categoryId) {
    where.categoryId = categoryId;
  }

  if (availabilityStatus) {
    where.availabilityStatus = availabilityStatus;
  }

  const [data, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: productInclude,
      orderBy: { id: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.product.count({ where }),
  ]);

  return {
    data,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}

export async function getAllProducts() {
  return prisma.product.findMany({
    include: productInclude,
  });
}

export async function getProductById(id: number) {
  return prisma.product.findUnique({
    where: { id },
    include: productInclude,
  });
}

export async function createProduct(formData: FormData) {
  const data = {
    title: formData.get("title") as string,
    description: formData.get("description") as string,
    price: parseInt(formData.get("price") as string, 10) || 0,
    discountPercentage: parseInt(formData.get("discountPercentage") as string, 10) || 0,
    weight: parseInt(formData.get("weight") as string, 10) || 0,
    warrantyInformation: (formData.get("warrantyInformation") as string) || "",
    shippingInformation: (formData.get("shippingInformation") as string) || "",
    availabilityStatus: (formData.get("availabilityStatus") as string) || "In Stock",
    thumbnail: (formData.get("thumbnail") as string) || "",
    images: JSON.parse((formData.get("images") as string) || "[]"),
    tags: JSON.parse((formData.get("tags") as string) || "[]"),
    era: (formData.get("era") as string) || "",
    genre: (formData.get("genre") as string) || "",
    format: (formData.get("format") as string) || "",
    year: new Date((formData.get("year") as string) || new Date()),
    binding: (formData.get("binding") as string) || "",
    categoryId: parseInt(formData.get("categoryId") as string, 10),
    conditionId: parseInt(formData.get("conditionId") as string, 10),
    authorId: parseInt(formData.get("authorId") as string, 10),
    publisherId: parseInt(formData.get("publisherId") as string, 10),
  };

  await prisma.product.create({ data });
  revalidatePath("/");
  redirect("/");
}

export async function updateProduct(id: number, formData: FormData) {
  const data: Record<string, unknown> = {};

  const title = formData.get("title");
  if (title) data.title = title;

  const description = formData.get("description");
  if (description) data.description = description;

  const price = formData.get("price");
  if (price) data.price = parseInt(price as string, 10);

  const discountPercentage = formData.get("discountPercentage");
  if (discountPercentage) data.discountPercentage = parseInt(discountPercentage as string, 10);

  const weight = formData.get("weight");
  if (weight) data.weight = parseInt(weight as string, 10);

  const warrantyInformation = formData.get("warrantyInformation");
  if (warrantyInformation) data.warrantyInformation = warrantyInformation;

  const shippingInformation = formData.get("shippingInformation");
  if (shippingInformation) data.shippingInformation = shippingInformation;

  const availabilityStatus = formData.get("availabilityStatus");
  if (availabilityStatus) data.availabilityStatus = availabilityStatus;

  const thumbnail = formData.get("thumbnail");
  if (thumbnail) data.thumbnail = thumbnail;

  const images = formData.get("images");
  if (images) data.images = JSON.parse(images as string);

  const tags = formData.get("tags");
  if (tags) data.tags = JSON.parse(tags as string);

  const era = formData.get("era");
  if (era) data.era = era;

  const genre = formData.get("genre");
  if (genre) data.genre = genre;

  const format = formData.get("format");
  if (format) data.format = format;

  const year = formData.get("year");
  if (year) data.year = new Date(year as string);

  const binding = formData.get("binding");
  if (binding) data.binding = binding;

  const categoryId = formData.get("categoryId");
  if (categoryId) data.categoryId = parseInt(categoryId as string, 10);

  const conditionId = formData.get("conditionId");
  if (conditionId) data.conditionId = parseInt(conditionId as string, 10);

  const authorId = formData.get("authorId");
  if (authorId) data.authorId = parseInt(authorId as string, 10);

  const publisherId = formData.get("publisherId");
  if (publisherId) data.publisherId = parseInt(publisherId as string, 10);

  await prisma.product.update({ where: { id }, data });
  revalidatePath("/");
}

export async function deleteProduct(id: number) {
  await prisma.product.delete({ where: { id } });
  revalidatePath("/");
}
```

- [ ] **Step 3: Create `apps/admin/lib/actions/lookups.ts`**

```ts
"use server";

import { prisma } from "@repo/db";

export async function getCategories() {
  return prisma.category.findMany({ orderBy: { name: "asc" } });
}

export async function getConditions() {
  return prisma.condition.findMany({ orderBy: { grade: "asc" } });
}

export async function getAuthors() {
  return prisma.author.findMany({ orderBy: { name: "asc" } });
}

export async function getPublishers() {
  return prisma.publisher.findMany({ orderBy: { name: "asc" } });
}
```

- [ ] **Step 4: Create `apps/admin/lib/actions/orders.ts`**

```ts
"use server";

import { prisma } from "@repo/db";
import { revalidatePath } from "next/cache";
import type { OrderStatus } from "@/lib/types/product";

export async function getOrders(page = 1, pageSize = 10, status?: string) {
  const where: Record<string, unknown> = {};

  if (status) {
    where.status = status;
  }

  const [data, total] = await Promise.all([
    prisma.order.findMany({
      where,
      include: { items: true },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.order.count({ where }),
  ]);

  return {
    data,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}

export async function getOrderById(id: string) {
  return prisma.order.findUnique({
    where: { id },
    include: { items: { include: { product: true } } },
  });
}

export async function updateOrderStatus(id: string, status: OrderStatus) {
  const updateData: Record<string, unknown> = { status };

  if (status === "SHIPPED") updateData.shippedAt = new Date();
  if (status === "DELIVERED") updateData.deliveredAt = new Date();

  await prisma.order.update({
    where: { id },
    data: updateData,
  });

  revalidatePath(`/orders/${id}`);
  revalidatePath("/orders");
}
```

- [ ] **Step 5: Commit**

```bash
git add apps/admin/lib/actions/
git commit -m "feat: add Prisma-based server actions for products, lookups, and orders"
```

---

## Task 5: Update the Delete Button Component

**Goal:** Wire `DeleteButton` to the new `deleteProduct` action.

- [ ] **Step 1: Update `apps/admin/components/form/delete-button.tsx`**

```ts
import Form from "next/form";
import { deleteProduct } from "@/lib/actions/products";
import { Trash2 } from "lucide-react";

export function DeleteButton({ id }: { id: number }) {
  const deleteAction = deleteProduct.bind(null, id);

  return (
    <Form action={deleteAction}>
      <button
        type="submit"
        className="p-1.5 rounded-md hover:bg-neutral-100 text-red-600 cursor-pointer"
      >
        <Trash2 size={16} />
      </button>
    </Form>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add apps/admin/components/form/delete-button.tsx
git commit -m "refactor: delete button uses new Prisma delete action"
```

---

## Task 6: Rewrite Product Forms

**Goal:** Add/Edit forms match the Prisma Product schema with all book fields and relation dropdowns.

- [ ] **Step 1: Rewrite `apps/admin/components/form/add-product-form.tsx`**

```tsx
import Form from "next/form";
import { createProduct } from "@/lib/actions/products";
import type { Category, Condition, Author, Publisher } from "@/lib/types/product";

interface AddProductFormProps {
  categories: Category[];
  conditions: Condition[];
  authors: Author[];
  publishers: Publisher[];
}

export default function AddProductForm({
  categories,
  conditions,
  authors,
  publishers,
}: AddProductFormProps) {
  return (
    <Form action={createProduct} className="py-2">
      <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 items-center">
        <label className="font-semibold" htmlFor="title">Title</label>
        <input className="border border-neutral-200 p-2 rounded-lg" type="text" id="title" name="title" required />

        <label className="font-semibold" htmlFor="description">Description</label>
        <textarea className="border border-neutral-200 p-2 rounded-lg" id="description" name="description" required />

        <label className="font-semibold" htmlFor="price">Price (öre)</label>
        <input className="border border-neutral-200 p-2 rounded-lg" type="number" id="price" name="price" min="0" required />

        <label className="font-semibold" htmlFor="discountPercentage">Discount %</label>
        <input className="border border-neutral-200 p-2 rounded-lg" type="number" id="discountPercentage" name="discountPercentage" min="0" max="100" defaultValue="0" />

        <label className="font-semibold" htmlFor="thumbnail">Thumbnail URL</label>
        <input className="border border-neutral-200 p-2 rounded-lg" type="url" id="thumbnail" name="thumbnail" />

        <label className="font-semibold" htmlFor="images">Images (JSON array)</label>
        <input className="border border-neutral-200 p-2 rounded-lg" type="text" id="images" name="images" defaultValue="[]" placeholder='["url1","url2"]' />

        <label className="font-semibold" htmlFor="tags">Tags (JSON array)</label>
        <input className="border border-neutral-200 p-2 rounded-lg" type="text" id="tags" name="tags" defaultValue="[]" placeholder='["tag1","tag2"]' />

        <label className="font-semibold" htmlFor="era">Era</label>
        <input className="border border-neutral-200 p-2 rounded-lg" type="text" id="era" name="era" />

        <label className="font-semibold" htmlFor="genre">Genre</label>
        <input className="border border-neutral-200 p-2 rounded-lg" type="text" id="genre" name="genre" />

        <label className="font-semibold" htmlFor="format">Format</label>
        <input className="border border-neutral-200 p-2 rounded-lg" type="text" id="format" name="format" />

        <label className="font-semibold" htmlFor="year">Year</label>
        <input className="border border-neutral-200 p-2 rounded-lg" type="date" id="year" name="year" />

        <label className="font-semibold" htmlFor="binding">Binding</label>
        <input className="border border-neutral-200 p-2 rounded-lg" type="text" id="binding" name="binding" />

        <label className="font-semibold" htmlFor="weight">Weight (g)</label>
        <input className="border border-neutral-200 p-2 rounded-lg" type="number" id="weight" name="weight" min="0" defaultValue="0" />

        <label className="font-semibold" htmlFor="warrantyInformation">Warranty</label>
        <input className="border border-neutral-200 p-2 rounded-lg" type="text" id="warrantyInformation" name="warrantyInformation" />

        <label className="font-semibold" htmlFor="shippingInformation">Shipping</label>
        <input className="border border-neutral-200 p-2 rounded-lg" type="text" id="shippingInformation" name="shippingInformation" />

        <label className="font-semibold" htmlFor="availabilityStatus">Status</label>
        <select className="border border-neutral-200 p-2 rounded-lg" id="availabilityStatus" name="availabilityStatus">
          <option value="In Stock">In Stock</option>
          <option value="Low Stock">Low Stock</option>
          <option value="Out of Stock">Out of Stock</option>
        </select>

        <label className="font-semibold" htmlFor="categoryId">Category</label>
        <select className="border border-neutral-200 p-2 rounded-lg" id="categoryId" name="categoryId" required>
          <option value="">Select category</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>

        <label className="font-semibold" htmlFor="conditionId">Condition</label>
        <select className="border border-neutral-200 p-2 rounded-lg" id="conditionId" name="conditionId" required>
          <option value="">Select condition</option>
          {conditions.map((c) => (
            <option key={c.id} value={c.id}>{c.grade} — {c.exterior}/{c.interior}</option>
          ))}
        </select>

        <label className="font-semibold" htmlFor="authorId">Author</label>
        <select className="border border-neutral-200 p-2 rounded-lg" id="authorId" name="authorId" required>
          <option value="">Select author</option>
          {authors.map((a) => (
            <option key={a.id} value={a.id}>{a.name}</option>
          ))}
        </select>

        <label className="font-semibold" htmlFor="publisherId">Publisher</label>
        <select className="border border-neutral-200 p-2 rounded-lg" id="publisherId" name="publisherId" required>
          <option value="">Select publisher</option>
          {publishers.map((p) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
      </div>
      <button type="submit" className="px-4 py-2 mt-2 rounded-lg border">
        Save
      </button>
    </Form>
  );
}
```

- [ ] **Step 2: Rewrite `apps/admin/components/form/edit-product-form.tsx`**

```tsx
import Form from "next/form";
import { updateProduct } from "@/lib/actions/products";
import type {
  ProductWithRelations,
  Category,
  Condition,
  Author,
  Publisher,
} from "@/lib/types/product";

interface EditProductFormProps {
  product: ProductWithRelations;
  categories: Category[];
  conditions: Condition[];
  authors: Author[];
  publishers: Publisher[];
}

export default function EditProductForm({
  product,
  categories,
  conditions,
  authors,
  publishers,
}: EditProductFormProps) {
  const updateAction = updateProduct.bind(null, product.id);

  return (
    <Form action={updateAction} className="py-2">
      <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 items-center">
        <label className="font-semibold" htmlFor="title">Title</label>
        <input className="border border-neutral-200 p-2 rounded-lg" type="text" id="title" name="title" defaultValue={product.title} required />

        <label className="font-semibold" htmlFor="description">Description</label>
        <textarea className="border border-neutral-200 p-2 rounded-lg" id="description" name="description" defaultValue={product.description} required />

        <label className="font-semibold" htmlFor="price">Price (öre)</label>
        <input className="border border-neutral-200 p-2 rounded-lg" type="number" id="price" name="price" min="0" defaultValue={product.price} required />

        <label className="font-semibold" htmlFor="discountPercentage">Discount %</label>
        <input className="border border-neutral-200 p-2 rounded-lg" type="number" id="discountPercentage" name="discountPercentage" min="0" max="100" defaultValue={product.discountPercentage} />

        <label className="font-semibold" htmlFor="thumbnail">Thumbnail URL</label>
        <input className="border border-neutral-200 p-2 rounded-lg" type="url" id="thumbnail" name="thumbnail" defaultValue={product.thumbnail} />

        <label className="font-semibold" htmlFor="images">Images (JSON array)</label>
        <input className="border border-neutral-200 p-2 rounded-lg" type="text" id="images" name="images" defaultValue={JSON.stringify(product.images)} />

        <label className="font-semibold" htmlFor="tags">Tags (JSON array)</label>
        <input className="border border-neutral-200 p-2 rounded-lg" type="text" id="tags" name="tags" defaultValue={JSON.stringify(product.tags)} />

        <label className="font-semibold" htmlFor="era">Era</label>
        <input className="border border-neutral-200 p-2 rounded-lg" type="text" id="era" name="era" defaultValue={product.era} />

        <label className="font-semibold" htmlFor="genre">Genre</label>
        <input className="border border-neutral-200 p-2 rounded-lg" type="text" id="genre" name="genre" defaultValue={product.genre} />

        <label className="font-semibold" htmlFor="format">Format</label>
        <input className="border border-neutral-200 p-2 rounded-lg" type="text" id="format" name="format" defaultValue={product.format} />

        <label className="font-semibold" htmlFor="year">Year</label>
        <input className="border border-neutral-200 p-2 rounded-lg" type="date" id="year" name="year" defaultValue={product.year ? new Date(product.year).toISOString().split("T")[0] : ""} />

        <label className="font-semibold" htmlFor="binding">Binding</label>
        <input className="border border-neutral-200 p-2 rounded-lg" type="text" id="binding" name="binding" defaultValue={product.binding} />

        <label className="font-semibold" htmlFor="weight">Weight (g)</label>
        <input className="border border-neutral-200 p-2 rounded-lg" type="number" id="weight" name="weight" min="0" defaultValue={product.weight} />

        <label className="font-semibold" htmlFor="warrantyInformation">Warranty</label>
        <input className="border border-neutral-200 p-2 rounded-lg" type="text" id="warrantyInformation" name="warrantyInformation" defaultValue={product.warrantyInformation} />

        <label className="font-semibold" htmlFor="shippingInformation">Shipping</label>
        <input className="border border-neutral-200 p-2 rounded-lg" type="text" id="shippingInformation" name="shippingInformation" defaultValue={product.shippingInformation} />

        <label className="font-semibold" htmlFor="availabilityStatus">Status</label>
        <select className="border border-neutral-200 p-2 rounded-lg" id="availabilityStatus" name="availabilityStatus" defaultValue={product.availabilityStatus}>
          <option value="In Stock">In Stock</option>
          <option value="Low Stock">Low Stock</option>
          <option value="Out of Stock">Out of Stock</option>
        </select>

        <label className="font-semibold" htmlFor="categoryId">Category</label>
        <select className="border border-neutral-200 p-2 rounded-lg" id="categoryId" name="categoryId" defaultValue={product.categoryId} required>
          <option value="">Select category</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>

        <label className="font-semibold" htmlFor="conditionId">Condition</label>
        <select className="border border-neutral-200 p-2 rounded-lg" id="conditionId" name="conditionId" defaultValue={product.conditionId} required>
          <option value="">Select condition</option>
          {conditions.map((c) => (
            <option key={c.id} value={c.id}>{c.grade} — {c.exterior}/{c.interior}</option>
          ))}
        </select>

        <label className="font-semibold" htmlFor="authorId">Author</label>
        <select className="border border-neutral-200 p-2 rounded-lg" id="authorId" name="authorId" defaultValue={product.authorId} required>
          <option value="">Select author</option>
          {authors.map((a) => (
            <option key={a.id} value={a.id}>{a.name}</option>
          ))}
        </select>

        <label className="font-semibold" htmlFor="publisherId">Publisher</label>
        <select className="border border-neutral-200 p-2 rounded-lg" id="publisherId" name="publisherId" defaultValue={product.publisherId} required>
          <option value="">Select publisher</option>
          {publishers.map((p) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
      </div>
      <button type="submit" className="px-4 py-2 mt-2 rounded-lg border">
        Save
      </button>
    </Form>
  );
}
```

- [ ] **Step 3: Update `apps/admin/app/products/add/page.tsx`**

```tsx
import AddProductForm from "@/components/form/add-product-form";
import { getCategories, getConditions, getAuthors, getPublishers } from "@/lib/actions/lookups";

export default async function AddProductPage() {
  const [categories, conditions, authors, publishers] = await Promise.all([
    getCategories(),
    getConditions(),
    getAuthors(),
    getPublishers(),
  ]);

  return (
    <div className="container mx-auto">
      <h1 className="mb-6 text-xl font-semibold md:text-2xl">Add New Product</h1>
      <AddProductForm
        categories={categories}
        conditions={conditions}
        authors={authors}
        publishers={publishers}
      />
    </div>
  );
}
```

- [ ] **Step 4: Update `apps/admin/app/products/edit/[id]/page.tsx`**

```tsx
import EditProductForm from "@/components/form/edit-product-form";
import { getProductById } from "@/lib/actions/products";
import { getCategories, getConditions, getAuthors, getPublishers } from "@/lib/actions/lookups";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [product, categories, conditions, authors, publishers] = await Promise.all([
    getProductById(parseInt(id, 10)),
    getCategories(),
    getConditions(),
    getAuthors(),
    getPublishers(),
  ]);

  if (!product) {
    return <h1>Product not found</h1>;
  }

  return (
    <div>
      <h1 className="font-bold text-xl md:text-2xl">Edit: {product.title}</h1>
      <EditProductForm
        product={product}
        categories={categories}
        conditions={conditions}
        authors={authors}
        publishers={publishers}
      />
    </div>
  );
}
```

- [ ] **Step 5: Commit**

```bash
git add apps/admin/components/form/ apps/admin/app/products/
git commit -m "feat: rewrite product forms to match Prisma schema with relation dropdowns"
```

---

## Task 7: Update Product Table and Main Page

**Goal:** Product list shows the correct columns and uses Prisma data.

- [ ] **Step 1: Update `apps/admin/components/product-table/product-table.tsx`**

```tsx
import type { ProductWithRelations } from "@/lib/types/product";
import ProductTableRow from "./product-table-row";

interface ProductsTableProps {
  products: ProductWithRelations[];
}

export default function ProductTable({ products }: ProductsTableProps) {
  return (
    <table className="w-full">
      <thead className="border-b border-neutral-200">
        <tr className="bg-neutral-50">
          <th className="p-4"></th>
          <th className="p-4 text-xs text-neutral-500">Product</th>
          <th className="p-4 text-xs text-neutral-500">Category</th>
          <th className="p-4 text-xs text-neutral-500">Price</th>
          <th className="p-4 text-xs text-neutral-500">Condition</th>
          <th className="p-4 text-xs text-neutral-500">Status</th>
          <th className="p-4 text-xs text-neutral-500 text-center">Actions</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-neutral-200 bg-white">
        {products.map((product) => (
          <ProductTableRow key={product.id} product={product} />
        ))}
      </tbody>
    </table>
  );
}
```

- [ ] **Step 2: Update `apps/admin/components/product-table/product-table-row.tsx`**

```tsx
import Image from "next/image";
import { Edit } from "lucide-react";
import type { ProductWithRelations } from "@/lib/types/product";
import { DeleteButton } from "@/components/form/delete-button";
import Link from "next/link";

interface ProductTableRowProps {
  product: ProductWithRelations;
}

function getStatusClasses(status: string | undefined): string {
  const normalized = status?.toLowerCase();
  if (normalized === "in stock") return "text-green-600";
  if (normalized === "low stock") return "text-yellow-600";
  if (normalized === "out of stock") return "text-red-600";
  return "text-neutral-600";
}

export default function ProductTableRow({ product }: ProductTableRowProps) {
  const formattedPrice = Math.round(product.price).toLocaleString("sv-SE");
  const imageUrl = Array.isArray(product.images) && product.images.length > 0
    ? product.images[0]
    : product.thumbnail;

  return (
    <tr className="text-center hover:bg-neutral-50">
      <td className="p-4">
        <Image
          src={imageUrl || "/placeholder.png"}
          alt={product.title}
          width={40}
          height={40}
          className="rounded object-cover"
        />
      </td>
      <td className="p-4 text-left">
        <div className="font-medium text-neutral-900">{product.title}</div>
        <div className="text-xs text-neutral-500">{product.author?.name}</div>
      </td>
      <td className="p-4 text-neutral-600">{product.category?.name}</td>
      <td className="p-4 font-medium text-neutral-900">{formattedPrice} kr</td>
      <td className="p-4 text-neutral-600">{product.condition?.grade}</td>
      <td className="p-4">
        <span className={`text-xs font-medium ${getStatusClasses(product.availabilityStatus)}`}>
          {product.availabilityStatus}
        </span>
      </td>
      <td className="p-4">
        <div className="flex gap-1 justify-center">
          <Link
            href={`/products/edit/${product.id}`}
            className="p-1.5 rounded-md hover:bg-neutral-100 text-purple-600 cursor-pointer"
          >
            <Edit size={16} />
          </Link>
          <DeleteButton id={product.id} />
        </div>
      </td>
    </tr>
  );
}
```

- [ ] **Step 3: Update `apps/admin/app/page.tsx`**

```tsx
import type { PaginatedProducts } from "@/lib/types/product";
import Sidebar from "@/components/sidebar";
import ProductFilterForm from "../components/form/product-filter-form";
import ProductTable from "@/components/product-table/product-table";
import PageHeader from "@/components/header/page-header";
import Pagination from "@/components/pagination/pagination";
import EmptyState from "../components/form/empty-state";
import { getProducts, getAllProducts } from "@/lib/actions/products";
import { getCategories } from "@/lib/actions/lookups";

const defaultLimit = 6;

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{
    search?: string;
    category?: string;
    status?: string;
    page?: string;
  }>;
}) {
  const params = await searchParams;
  const search = params?.search || "";
  const category = params?.category || "";
  const status = params?.status || "";
  const currentPage = Number(params?.page) || 1;

  const [categories, allProducts, { data: products, total, totalPages }] = await Promise.all([
    getCategories(),
    getAllProducts(),
    getProducts(
      currentPage,
      defaultLimit,
      search,
      category ? parseInt(category, 10) : undefined,
      status || undefined,
    ),
  ]);

  const totalProducts = allProducts.length;
  const inStock = allProducts.filter(
    (p) => p.availabilityStatus?.toLowerCase() === "in stock",
  ).length;
  const lowStock = allProducts.filter(
    (p) => p.availabilityStatus?.toLowerCase() === "low stock",
  ).length;
  const outOfStock = allProducts.filter(
    (p) => p.availabilityStatus?.toLowerCase() === "out of stock",
  ).length;

  return (
    <div className="min-h-screen md:grid md:[grid-template-areas:'sidebar_header_header''sidebar_form_form''sidebar_main_main']">
      <Sidebar className="md:[grid-area:sidebar]" />
      <PageHeader
        totalProducts={totalProducts}
        inStock={inStock}
        lowStock={lowStock}
        outOfStock={outOfStock}
      />
      <main className="min-h-screen md:[grid-area:main] p-6">
        <ProductFilterForm
          categories={categories}
          search={search}
          category={category}
          status={status}
        />
        {products.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="mt-4 border rounded-xl border-neutral-200 overflow-hidden">
            <ProductTable products={products} />
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalProducts={total}
              productsPerPage={defaultLimit}
            />
          </div>
        )}
      </main>
    </div>
  );
}
```

- [ ] **Step 4: Commit**

```bash
git add apps/admin/components/product-table/ apps/admin/app/page.tsx
git commit -m "feat: update product table and main page to use Prisma data"
```

---

## Task 8: Add Orders Section

**Goal:** New `/orders` route with list table and detail page.

- [ ] **Step 1: Create `apps/admin/components/order-table/order-table.tsx`**

```tsx
import type { OrderWithItems } from "@/lib/types/product";
import OrderTableRow from "./order-table-row";

interface OrdersTableProps {
  orders: (OrderWithItems & { items: { id: string }[] })[];
}

export default function OrderTable({ orders }: OrdersTableProps) {
  return (
    <table className="w-full">
      <thead className="border-b border-neutral-200">
        <tr className="bg-neutral-50">
          <th className="p-4 text-xs text-neutral-500">Order ID</th>
          <th className="p-4 text-xs text-neutral-500">Customer</th>
          <th className="p-4 text-xs text-neutral-500">Items</th>
          <th className="p-4 text-xs text-neutral-500">Total</th>
          <th className="p-4 text-xs text-neutral-500">Status</th>
          <th className="p-4 text-xs text-neutral-500">Date</th>
          <th className="p-4 text-xs text-neutral-500">Actions</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-neutral-200 bg-white">
        {orders.map((order) => (
          <OrderTableRow key={order.id} order={order} />
        ))}
      </tbody>
    </table>
  );
}
```

- [ ] **Step 2: Create `apps/admin/components/order-table/order-table-row.tsx`**

```tsx
import Link from "next/link";
import type { OrderWithItems } from "@/lib/types/product";
import StatusBadge from "@/components/order-detail/status-badge";

interface OrderTableRowProps {
  order: OrderWithItems & { items: { id: string }[] };
}

export default function OrderTableRow({ order }: OrderTableRowProps) {
  const formattedTotal = Math.round(order.totalAmount).toLocaleString("sv-SE");
  const formattedDate = new Date(order.createdAt).toLocaleDateString("sv-SE");
  const shortId = order.id.slice(0, 8);

  return (
    <tr className="text-center hover:bg-neutral-50">
      <td className="p-4 font-mono text-sm">{shortId}</td>
      <td className="p-4 text-left">{order.customerEmail}</td>
      <td className="p-4">{order.items.length}</td>
      <td className="p-4 font-medium">{formattedTotal} kr</td>
      <td className="p-4">
        <StatusBadge status={order.status} />
      </td>
      <td className="p-4 text-neutral-600">{formattedDate}</td>
      <td className="p-4">
        <Link
          href={`/orders/${order.id}`}
          className="text-purple-600 hover:underline text-sm"
        >
          View
        </Link>
      </td>
    </tr>
  );
}
```

- [ ] **Step 3: Create `apps/admin/components/order-detail/status-badge.tsx`**

```tsx
import type { OrderStatus } from "@/lib/types/product";

const statusConfig: Record<OrderStatus, { bg: string; text: string }> = {
  PENDING: { bg: "bg-yellow-100", text: "text-yellow-800" },
  PAID: { bg: "bg-blue-100", text: "text-blue-800" },
  SHIPPED: { bg: "bg-purple-100", text: "text-purple-800" },
  DELIVERED: { bg: "bg-green-100", text: "text-green-800" },
  CANCELLED: { bg: "bg-red-100", text: "text-red-800" },
};

export default function StatusBadge({ status }: { status: string }) {
  const config = statusConfig[status as OrderStatus] || {
    bg: "bg-neutral-100",
    text: "text-neutral-800",
  };

  return (
    <span className={`text-xs font-medium px-2 py-1 rounded ${config.bg} ${config.text}`}>
      {status}
    </span>
  );
}
```

- [ ] **Step 4: Create `apps/admin/app/orders/page.tsx`**

```tsx
import Sidebar from "@/components/sidebar";
import OrderTable from "@/components/order-table/order-table";
import { getOrders } from "@/lib/actions/orders";

const defaultLimit = 10;

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; status?: string }>;
}) {
  const params = await searchParams;
  const currentPage = Number(params?.page) || 1;
  const status = params?.status || "";

  const { data: orders, totalPages, total } = await getOrders(
    currentPage,
    defaultLimit,
    status || undefined,
  );

  return (
    <div className="min-h-screen md:grid md:[grid-template-areas:'sidebar_header''sidebar_main']">
      <Sidebar className="md:[grid-area:sidebar]" />
      <header className="border-b border-neutral-200 p-6">
        <h1 className="text-2xl font-semibold">Orders</h1>
        <p className="text-sm text-gray-500">{total} total orders</p>
      </header>
      <main className="min-h-screen md:[grid-area:main] p-6">
        {orders.length === 0 ? (
          <div className="text-center py-12 text-gray-500">No orders found.</div>
        ) : (
          <div className="border rounded-xl border-neutral-200 overflow-hidden">
            <OrderTable orders={orders} />
          </div>
        )}
      </main>
    </div>
  );
}
```

- [ ] **Step 5: Create `apps/admin/components/order-detail/order-detail.tsx`**

```tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateOrderStatus } from "@/lib/actions/orders";
import type { OrderStatus } from "@/lib/types/product";
import StatusBadge from "./status-badge";

interface OrderDetailProps {
  order: {
    id: string;
    customerEmail: string;
    customerName: string | null;
    totalAmount: number;
    currency: string;
    status: string;
    shippingName: string;
    shippingLine1: string;
    shippingLine2: string | null;
    shippingCity: string;
    shippingPostal: string;
    shippingCountry: string;
    createdAt: Date;
    paidAt: Date | null;
    shippedAt: Date | null;
    deliveredAt: Date | null;
    items: {
      id: string;
      title: string;
      unitPrice: number;
      totalPrice: number;
      product: { title: string } | null;
    }[];
  };
}

const allStatuses: OrderStatus[] = ["PENDING", "PAID", "SHIPPED", "DELIVERED", "CANCELLED"];

export default function OrderDetail({ order }: OrderDetailProps) {
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus>(
    order.status as OrderStatus,
  );
  const [updating, setUpdating] = useState(false);
  const router = useRouter();

  async function handleStatusUpdate() {
    setUpdating(true);
    await updateOrderStatus(order.id, selectedStatus);
    setUpdating(false);
    router.refresh();
  }

  const formattedTotal = Math.round(order.totalAmount).toLocaleString("sv-SE");

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <div>
          <h2 className="font-semibold mb-2">Order Info</h2>
          <p><span className="text-neutral-500">ID:</span> {order.id}</p>
          <p><span className="text-neutral-500">Customer:</span> {order.customerEmail}</p>
          {order.customerName && (
            <p><span className="text-neutral-500">Name:</span> {order.customerName}</p>
          )}
          <p><span className="text-neutral-500">Total:</span> {formattedTotal} kr</p>
          <p>
            <span className="text-neutral-500">Status:</span>{" "}
            <StatusBadge status={order.status} />
          </p>
          <p><span className="text-neutral-500">Created:</span> {new Date(order.createdAt).toLocaleString("sv-SE")}</p>
          {order.paidAt && <p><span className="text-neutral-500">Paid:</span> {new Date(order.paidAt).toLocaleString("sv-SE")}</p>}
          {order.shippedAt && <p><span className="text-neutral-500">Shipped:</span> {new Date(order.shippedAt).toLocaleString("sv-SE")}</p>}
          {order.deliveredAt && <p><span className="text-neutral-500">Delivered:</span> {new Date(order.deliveredAt).toLocaleString("sv-SE")}</p>}
        </div>

        <div>
          <h2 className="font-semibold mb-2">Shipping Address</h2>
          <p>{order.shippingName}</p>
          <p>{order.shippingLine1}</p>
          {order.shippingLine2 && <p>{order.shippingLine2}</p>}
          <p>{order.shippingPostal} {order.shippingCity}</p>
          <p>{order.shippingCountry}</p>
        </div>
      </div>

      <div>
        <h2 className="font-semibold mb-2">Update Status</h2>
        <div className="flex gap-2 items-center">
          <select
            className="border border-neutral-200 p-2 rounded-lg"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as OrderStatus)}
          >
            {allStatuses.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <button
            type="button"
            onClick={handleStatusUpdate}
            disabled={updating || selectedStatus === order.status}
            className="px-4 py-2 bg-purple-900/80 text-white rounded-lg hover:bg-purple-900 disabled:opacity-50"
          >
            {updating ? "Updating..." : "Update Status"}
          </button>
        </div>
      </div>

      <div>
        <h2 className="font-semibold mb-2">Items</h2>
        <table className="w-full">
          <thead className="border-b border-neutral-200">
            <tr className="bg-neutral-50">
              <th className="p-4 text-xs text-neutral-500 text-left">Product</th>
              <th className="p-4 text-xs text-neutral-500">Unit Price</th>
              <th className="p-4 text-xs text-neutral-500">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200">
            {order.items.map((item) => (
              <tr key={item.id}>
                <td className="p-4">{item.title}</td>
                <td className="p-4 text-center">{Math.round(item.unitPrice).toLocaleString("sv-SE")} kr</td>
                <td className="p-4 text-center font-medium">{Math.round(item.totalPrice).toLocaleString("sv-SE")} kr</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
```

- [ ] **Step 6: Create `apps/admin/app/orders/[id]/page.tsx`**

```tsx
import Sidebar from "@/components/sidebar";
import OrderDetail from "@/components/order-detail/order-detail";
import { getOrderById } from "@/lib/actions/orders";

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await getOrderById(id);

  if (!order) {
    return <h1>Order not found</h1>;
  }

  return (
    <div className="min-h-screen md:grid md:[grid-template-areas:'sidebar_header''sidebar_main']">
      <Sidebar className="md:[grid-area:sidebar]" />
      <header className="border-b border-neutral-200 p-6">
        <h1 className="text-2xl font-semibold">Order: {order.id.slice(0, 8)}</h1>
      </header>
      <main className="min-h-screen md:[grid-area:main] p-6">
        <OrderDetail order={order} />
      </main>
    </div>
  );
}
```

- [ ] **Step 7: Commit**

```bash
git add apps/admin/components/order-table/ apps/admin/components/order-detail/ apps/admin/app/orders/
git commit -m "feat: add orders list and detail pages with status management"
```

---

## Task 9: Update Sidebar Navigation

**Goal:** Add "Orders" link to the sidebar.

- [ ] **Step 1: Update `apps/admin/components/sidebar/sidebar-nav.tsx`**

Read the current file first to understand the nav item pattern. Add an Orders entry:

```tsx
// Add to the nav items array:
{ link: "/orders", label: "Orders", icon: "shopping-cart" }
```

(Use whatever icon name the existing pattern uses from lucide-react.)

- [ ] **Step 2: Commit**

```bash
git add apps/admin/components/sidebar/sidebar-nav.tsx
git commit -m "feat: add Orders link to sidebar navigation"
```

---

## Task 10: Install Dependencies and Verify Build

**Goal:** Everything compiles and runs.

- [ ] **Step 1: Install all dependencies from root**

```bash
npm install
```

- [ ] **Step 2: Generate Prisma client**

```bash
cd packages/db && npx prisma generate
```

- [ ] **Step 3: Build webshop**

```bash
npm run build -w apps/webshop
```

Expected: No errors.

- [ ] **Step 4: Build admin**

```bash
npm run build -w apps/admin
```

Expected: No errors.

- [ ] **Step 5: Run both apps and test**

```bash
npm run webshop
# In another terminal:
npm run admin
```

Test:
1. Admin home page loads with product data from DB
2. Click "Add product" — form shows all fields with dropdowns
3. Create a product — it appears in the list and in the webshop
4. Edit a product — changes reflect in both admin and webshop
5. Delete a product — removed from both
6. Navigate to `/orders` — orders list loads
7. Click "View" on an order — detail page shows items
8. Change order status — badge updates

- [ ] **Step 6: Final commit for any fixes**

```bash
git add -A
git commit -m "fix: address build issues and verify admin-webshop integration"
```

---

## Verification Checklist

- [ ] `packages/db` exports Prisma client and types
- [ ] Webshop builds and runs with `@repo/db` import
- [ ] Admin builds and runs with `@repo/db` import
- [ ] Admin home page shows products from PostgreSQL
- [ ] Product filter/search works with Prisma queries
- [ ] Add product form has all Prisma fields with dropdowns
- [ ] Edit product form pre-populates with existing data
- [ ] Create/update/delete products works
- [ ] Changes appear in both admin and webshop
- [ ] Orders list page loads and shows orders
- [ ] Order detail page shows items and shipping info
- [ ] Order status can be updated
- [ ] Sidebar has working Orders link
- [ ] No references to json-server or old API_URL remain in admin

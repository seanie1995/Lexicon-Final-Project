# Admin → Webshop Database Integration

## Context

The admin interface (`apps/admin`) currently uses a json-server API with a simplified Product model that doesn't match the webshop's Prisma schema. The admin needs to become the full administration panel for the webshop's PostgreSQL database, managing Products and Orders using the webshop's data model as the source of truth.

## Scope

- **In scope:** Product CRUD, Order viewing and status management, shared data layer via `packages/db`
- **Out of scope:** Auth on admin, managing Categories/Authors/Publishers/Conditions as standalone CRUD (they appear as dropdowns in product forms only)

---

## 1. Architecture: `packages/db` as Shared Data Layer

Move Prisma ownership from `apps/webshop/prisma/` to `packages/db/`. Both apps import `@repo/db` for the Prisma client and types.

### `packages/db/` structure

```
packages/db/
├── prisma/
│   ├── schema.prisma        ← moved from apps/webshop/prisma/
│   ├── seed.ts              ← moved from apps/webshop/prisma/
│   └── bookSeedData.ts      ← moved from apps/webshop/prisma/
├── src/
│   └── index.ts             ← exports prisma client + re-exports Prisma types
├── package.json             ← @prisma/client, prisma as deps
└── tsconfig.json
```

### Changes to `apps/webshop`

- Remove `prisma/` directory (moved to `packages/db`)
- Update `package.json`: remove `prisma` and `@prisma/client` direct deps, add `@repo/db`
- Update imports: `import { prisma } from "@repo/db"` in `src/lib/prisma.ts` (or replace that file entirely)
- Update `prisma.config.ts` to point to `../packages/db/prisma/schema.prisma`
- Prisma commands run from root or from `packages/db/`

### Changes to `apps/admin`

- Add `@repo/db` dependency
- Add `.env.local` with `DATABASE_URL` (same Postgres connection string)
- Remove all json-server fetch calls

### Environment

- `DATABASE_URL` must be available in both apps (already in webshop's `.env`, admin gets its own `.env.local`)
- Root `package.json` gets a `prisma` script pointing to `packages/db/`

---

## 2. Data Layer: Admin Server Actions

### Product Actions — `apps/admin/lib/actions/products.ts`

Replace current `lib/actions.ts` (json-server fetches) with Prisma-based server actions.

| Action | Description | Input |
|--------|-------------|-------|
| `getProducts(filters, page, pageSize)` | Paginated list with search/filter | search, categoryId, availabilityStatus, page, pageSize |
| `getProductById(id)` | Single product with all relations | product ID |
| `createProduct(data)` | Create product | All product fields (see form section) |
| `updateProduct(id, data)` | Partial update | product ID + partial fields |
| `deleteProduct(id)` | Delete product | product ID |

**Relations included in reads:** `category`, `condition`, `author`, `publisher`

**Pagination response shape** (matches webshop's `PaginatedResult`):

```ts
{
  data: ProductWithRelations[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
```

### Lookup Actions — for dropdown population in forms

| Action | Returns |
|--------|---------|
| `getCategories()` | `Category[]` |
| `getConditions()` | `Condition[]` |
| `getAuthors()` | `Author[]` |
| `getPublishers()` | `Publisher[]` |

### Order Actions — `apps/admin/lib/actions/orders.ts`

| Action | Description | Input |
|--------|-------------|-------|
| `getOrders(filters, page, pageSize)` | Paginated list, optional status filter | status, page, pageSize |
| `getOrderById(id)` | Single order with items and product details | order ID |
| `updateOrderStatus(id, status)` | Change order status | order ID, new OrderStatus |

### Files to delete

- `apps/admin/lib/actions.ts` — replaced by new actions files
- `apps/admin/lib/types/product.ts` — replaced with Prisma type re-exports

### Types

Admin types in `apps/admin/lib/types/` get replaced:

```ts
// apps/admin/lib/types/product.ts — new version
import type { Prisma } from "@prisma/client";

export type ProductWithRelations = Prisma.ProductGetPayload<{
  include: { category: true; condition: true; author: true; publisher: true };
}>;

export type Category = { id: number; name: string };
export type Condition = { id: number; exterior: string; interior: string; grade: string };
export type Author = { id: number; name: string; description: string };
export type Publisher = { id: number; name: string; description: string };
```

---

## 3. Product Form Rewrite

Replace `add-product-form.tsx` and `edit-product-form.tsx` to match the Prisma Product schema. Remove `brand`, `stock`, `sku` fields. Add book-specific fields.

### Form field groups

**Basic Info:**
- `title` — text input, required
- `description` — textarea, required
- `thumbnail` — URL input, required
- `images` — JSON array input (comma-separated URLs or multi-line)
- `tags` — JSON array input (comma-separated tags)

**Pricing:**
- `price` — number input (Int, stored in öre), required
- `discountPercentage` — number input (0-100)

**Book Details:**
- `era` — text input
- `genre` — text input
- `format` — text input
- `year` — date input
- `binding` — text input

**Logistics:**
- `weight` — number input
- `warrantyInformation` — text input
- `shippingInformation` — text input
- `availabilityStatus` — select (In Stock / Low Stock / Out of Stock)

**Relations (select dropdowns populated from DB):**
- `categoryId` — select from `getCategories()`
- `conditionId` — select from `getConditions()`
- `authorId` — select from `getAuthors()`
- `publisherId` — select from `getPublishers()`

### Edit form pre-population

`edit-product-form.tsx` receives the full `ProductWithRelations` object. All fields pre-populate with `defaultValue`. Relation fields pre-select the current relation ID.

### Validation

- Server-side validation in actions (required fields, valid IDs for relations)
- HTML validation attributes on inputs (required, min, max)
- No additional validation library needed (keep it simple)

---

## 4. Product Table & List Updates

### Updated columns

| Column | Content |
|--------|---------|
| Thumbnail | `product.thumbnail` image |
| Product | `product.title` + `product.author.name` |
| Category | `product.category.name` |
| Price | Formatted as SEK |
| Condition | `product.condition.grade` |
| Status | `product.availabilityStatus` (color-coded) |
| Actions | Edit link + Delete button |

### Updated `ProductTableRow`

- Show author name instead of SKU
- Show condition grade instead of stock count
- Price formatting: `Math.round(price).toLocaleString("sv-SE") + " kr"`

### Filter form

Keep existing search + category + status filters. The `ProductFilterForm` already handles this well — just update the data fetching to use Prisma queries instead of json-server query params.

---

## 5. Orders Section (New)

### Route: `/orders`

### Order List Table

| Column | Content |
|--------|---------|
| Order ID | First 8 chars of UUID |
| Customer | `customerEmail` |
| Items | Count of order items |
| Total | Formatted as SEK |
| Status | Color-coded badge |
| Date | `createdAt` formatted |
| Actions | View detail link |

### Order Detail: `/orders/[id]`

- Order info header: customer email, shipping address, dates
- Status dropdown: PENDING, PAID, SHIPPED, DELIVERED, CANCELLED
- Update status button (calls `updateOrderStatus`)
- Order items table: product title, unit price, total price

### Status badge colors

| Status | Color |
|--------|-------|
| PENDING | Yellow |
| PAID | Blue |
| SHIPPED | Purple |
| DELIVERED | Green |
| CANCELLED | Red |

### Sidebar

Add "Orders" nav item to `apps/admin/components/sidebar/sidebar-nav.tsx`.

---

## 6. Migration Steps (Implementation Order)

1. **Set up `packages/db`** — Move Prisma schema + client, update package.json, export from index.ts
2. **Update `apps/webshop`** — Import from `@repo/db`, remove local prisma/ dir
3. **Add `@repo/db` to `apps/admin`** — Update admin package.json, add .env.local
4. **Rewrite admin types** — Replace `lib/types/product.ts` with Prisma types
5. **Write new server actions** — `actions/products.ts` and `actions/orders.ts`
6. **Update product table** — New columns, updated row component
7. **Rewrite product forms** — Add/Edit forms with all Prisma fields + dropdowns
8. **Update main page** — Wire up new actions and types
9. **Add orders section** — New route, table, detail page, sidebar link
10. **Delete old code** — Remove `lib/actions.ts`, old types, json-server references

---

## Key Decisions

- **Prisma in `packages/db`, not in admin directly** — shared schema, single source of truth
- **Admin uses Prisma directly, no API layer** — simplest approach, same as webshop
- **No auth on admin for now** — focus on data migration first
- **Product form is the webshop's schema** — admin adapts to webshop, not the other way around
- **Orders are view + status-change only** — no order creation or deletion from admin
- **No separate CRUD for Authors/Publishers/Conditions/Categories** — they appear as dropdowns in product forms, managed via seed data or direct DB access for now

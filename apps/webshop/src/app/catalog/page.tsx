import { Search } from "lucide-react";
import type { Metadata } from "next";
import CatalogFilters from "@/components/catalog-filters";
import CatalogPagination from "@/components/catalog-pagination";
import CatalogSort from "@/components/catalog-sort";
import ProductCard from "@/components/product-card";
import { getProducts } from "@/lib/actions/products";

export const metadata: Metadata = {
  title: "The General Catalog | The Digital Archivist",
  description:
    "Browse our curated collection of rare first editions, illuminated manuscripts and leather-bound treasures across the centuries.",
};

type SearchParams = Record<string, string | string[] | undefined>;

export const dynamic = "force-dynamic";

function toArray(value: string | string[] | undefined): string[] {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: SearchParams | Promise<SearchParams>;
}) {
  const sp = await searchParams;

  const search = typeof sp.search === "string" ? sp.search : undefined;
  const genres = toArray(sp.genre).filter(Boolean);
  const conditionGrades = toArray(sp.condition).filter(Boolean);
  const era = typeof sp.era === "string" ? sp.era : undefined;

  const sortParam = typeof sp.sort === "string" ? sp.sort : "title-asc";
  const [sortByRaw, sortOrderRaw] = sortParam.split("-");

  const validSorts = ["title", "price", "year", "author"] as const;
  type ValidSort = (typeof validSorts)[number];

  const sortBy: ValidSort = validSorts.includes(sortByRaw as ValidSort)
    ? (sortByRaw as ValidSort)
    : "title";

  const sortOrder = sortOrderRaw === "desc" ? "desc" : "asc";

  const pageParam =
    typeof sp.page === "string" ? Number.parseInt(sp.page, 10) : 1;

  const currentPage =
    Number.isNaN(pageParam) || pageParam < 1 ? 1 : pageParam;

  const {
    data: products,
    total,
    pageSize,
    totalPages,
  } = await getProducts({
    search,
    genres,
    conditionGrades,
    era,
    sortBy,
    sortOrder,
    page: currentPage,
  });

  const uniqueValues = <T,>(values: T[]) => [...new Set(values)];

  const filterSections =
    products.length > 0
      ? [
          {
            title: "Genre",
            type: "checkbox" as const,
            options: uniqueValues(products.map((p) => p.genre)).sort(),
          },
          {
            title: "Era",
            type: "radio" as const,
            options: uniqueValues(products.map((p) => p.era)).sort(),
          },
          {
            title: "Condition",
            type: "checkbox" as const,
            options: uniqueValues(
              products.map((p) => p.condition.grade)
            ).sort(),
          },
        ]
      : [];

  return (
    <main className="min-h-screen bg-surface pt-24">
      {/* HERO — aligned with Contact page */}
      <section className="mx-auto flex max-w-screen-2xl flex-col items-start gap-14 px-8 py-20 md:flex-row md:gap-16 lg:px-12">
        <div className="w-full space-y-10 md:w-5/12 md:space-y-12">
          <div className="space-y-4">
            <p className="font-label text-[11px] font-semibold uppercase tracking-[0.28em] text-secondary">
              Archive Collection
            </p>
            <h1 className="max-w-sm font-headline text-5xl italic leading-[0.95] text-primary md:text-6xl lg:text-7xl">
              The General Catalog
            </h1>
          </div>

          <p className="max-w-md text-lg leading-[1.9] text-on-surface-variant">
            Browse our curated collection of rare first editions,
            illuminated manuscripts, and historically significant
            volumes spanning centuries of literary heritage.
          </p>
        </div>
      </section>

      {/* CONTENT */}
      <section className="mx-auto max-w-screen-2xl px-8 pb-24 lg:px-12">
        <div className="flex flex-col gap-12 lg:flex-row lg:gap-16">
          {products.length > 0 && (
            <aside aria-label="Catalog filters">
              <CatalogFilters
                sections={filterSections}
                selected={{
                  Genre: genres,
                  Era: era ? [era] : [],
                  Condition: conditionGrades,
                }}
              />
            </aside>
          )}

          <div className="min-w-0 flex-1">
            {products.length > 0 && (
              <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                {totalPages > 1 && (
                  <p
                    className="font-label text-sm text-outline"
                    aria-live="polite"
                  >
                    Showing {(currentPage - 1) * pageSize + 1}–{Math.min(currentPage * pageSize, total)} of {total} results
                  </p>
                )}
                <CatalogSort />
              </div>
            )}

            {products.length === 0 ? (
              <div
                className="flex flex-col items-center justify-center py-24 text-center"
                role="status"
              >
                <div className="mb-6 rounded-full bg-surface-container-low p-6">
                  <Search
                    className="h-12 w-12 text-primary opacity-50"
                    aria-hidden="true"
                  />
                </div>
                <h2 className="font-headline text-2xl text-on-surface mb-2">
                  No results found
                </h2>
                <p className="font-body text-secondary max-w-md">
                  {search
                    ? `No volumes matching "${search}" were found.`
                    : "No volumes match your current filters."}
                </p>
              </div>
            ) : (
              <div
                className="grid grid-cols-1 gap-x-10 gap-y-14 sm:grid-cols-2 xl:grid-cols-3"
                aria-label="Product list"
              >
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}

            {products.length > 0 && (
              <nav aria-label="Pagination">
                <CatalogPagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                />
              </nav>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
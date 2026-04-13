import type { Metadata } from "next";
import CatalogFilters from "@/components/catalog-filters";
import CatalogHero from "@/components/catalog-hero";
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

// Ensure this route is rendered on each request with query params.
// Without this, Next may prerender/cache `/catalog` and ignore `searchParams` updates.
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

	const pageParam = typeof sp.page === "string" ? Number.parseInt(sp.page, 10) : 1;
	const currentPage = Number.isNaN(pageParam) || pageParam < 1 ? 1 : pageParam;

	const { data: products, total, pageSize, totalPages } = await getProducts({
		search,
		genres,
		conditionGrades,
		era,
		sortBy,
		sortOrder,
		page: currentPage,
	});
	const uniqueValues = <T,>(values: T[]) => [...new Set(values)];

	const filterSections = [
		{
			title: "Genre",
			type: "checkbox" as const,
			options: uniqueValues(products.map((product) => product.genre)).sort(),
		},
		{
			title: "Era",
			type: "radio" as const,
			options: uniqueValues(products.map((product) => product.era)).sort(),
		},
		{
			title: "Condition",
			type: "checkbox" as const,
			options: uniqueValues(
				products.map((product) => product.condition.grade),
			).sort(),
		},
	];

	return (
		<main className="mx-auto max-w-screen-2xl px-8 pb-24 pt-24">
			<CatalogHero />

			<div className="flex flex-col gap-12 lg:flex-row lg:gap-16">

				<CatalogFilters
					sections={filterSections}
					selected={{
						Genre: genres,
						Era: era ? [era] : [],
						Condition: conditionGrades,
					}}
				/>
				<div className="min-w-0 flex-1">
					<div className="mb-8 flex items-end justify-between">
						{totalPages > 1 && (
							<p className="mt-12 text-center font-label text-sm text-outline">
								Showing {(currentPage - 1) * pageSize + 1}&ndash;
								{Math.min(currentPage * pageSize, total)} of {total} results
							</p>
						)}
						<CatalogSort />
					</div>
					<div className="grid grid-cols-1 gap-x-10 gap-y-14 sm:grid-cols-2 xl:grid-cols-3">
						{products.map((product) => (
							<ProductCard key={product.id} product={product} />
						))}
					</div>

					<CatalogPagination currentPage={currentPage} totalPages={totalPages} />
				</div>
			</div>
		</main>
	);
}

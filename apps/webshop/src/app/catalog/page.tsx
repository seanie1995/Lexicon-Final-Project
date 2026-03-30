import CatalogFilters from "@/components/catalog-filters";
import CatalogHero from "@/components/catalog-hero";
import CatalogSort from "@/components/catalog-sort";
import ProductCard from "@/components/product-card";
import { getProducts } from "@/lib/actions/products";

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

	const { data: products } = await getProducts({
		genres,
		conditionGrades,
		era,
		sortBy,
		sortOrder,
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
						<h1 className="font-headline text-3xl">Catalog</h1>
						<CatalogSort />
					</div>
					<div className="grid grid-cols-1 gap-x-10 gap-y-14 sm:grid-cols-2 xl:grid-cols-3">
						{products.map((product) => (
							<ProductCard key={product.id} product={product} />
						))}
					</div>
				</div>
			</div>
		</main>
	);
}

import CatalogFilters from "@/components/catalog-filters";
import CatalogHero from "@/components/catalog-hero";
import ProductCard from "@/components/product-card";
import { getProducts } from "@/lib/actions/products";

export default async function Home() {
	const { data: products } = await getProducts();
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
				<CatalogFilters sections={filterSections} />
				<div className="min-w-0 flex-1">
					<h1 className="mb-8 font-headline text-3xl">Catalog</h1>
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

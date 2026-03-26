import ProductCard from "@/components/product-card";
import CatalogHero from "@/components/catalog-hero";
import { getProducts } from "@/lib/actions/products";

export default async function CatalogPage() {
	const { data: products } = await getProducts();

	return (
		<main className="max-w-7xl mx-auto p-8 pt-24">
			<CatalogHero />
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
				{products.map((product) => (
					<ProductCard key={product.id} product={product} />
				))}
			</div>
		</main>
	);
}

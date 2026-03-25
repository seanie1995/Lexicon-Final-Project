import ProductCard from "@/components/product-card";
import { getProducts } from "@/lib/actions/products";

export default async function Home() {
	const { data: products } = await getProducts();

	return (
		<main className="max-w-7xl mx-auto p-8">
			<h1 className="font-headline text-3xl mb-8">Catalog</h1>
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
				{products.map((product) => (
					<ProductCard key={product.id} product={product} />
				))}
			</div>
		</main>
	);
}

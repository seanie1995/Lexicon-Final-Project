import type { Product } from "@/app/types/types";
import ProductCard from "./product-card";

const ProductGrid = ({ products }: { products: Product[] }) => {
	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
			{products.map((product) => (
				<ProductCard key={product.id} product={product} />
			))}
		</div>
	);
};

export default ProductGrid;

import type { Product } from "@/app/types/types";

const ProductCard = ({ product }: { product: Product }) => {
	const image = product.thumbnail || product.images[0] || "";

	return (
		<div className="group">
			<div className="aspect-3/4 overflow-hidden bg-surface-container-low mb-6 relative">
				<img
					className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
					alt={product.title}
					src={image}
				/>
				<div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
			</div>
			<div className="space-y-2">
				<div className="flex justify-between items-start">
					<h3 className="font-headline text-xl text-on-surface leading-tight group-hover:text-primary transition-colors">
						{product.title}
					</h3>
					<span className="font-label text-sm text-primary font-semibold">
						{product.price.toLocaleString()} SEK
					</span>
				</div>
				<p className="font-body italic text-secondary">{product.author.name}</p>
				<div className="flex items-center gap-3 pt-2">
					<span className="font-label text-[10px] uppercase tracking-widest px-2 py-1 bg-surface-container-highest text-secondary">
						{new Date(product.year).getFullYear()}
					</span>
					<span className="font-label text-[10px] uppercase tracking-widest px-2 py-1 bg-surface-container-highest text-secondary">
						{product.condition.grade}
					</span>
				</div>
			</div>
		</div>
	);
};

export default ProductCard;

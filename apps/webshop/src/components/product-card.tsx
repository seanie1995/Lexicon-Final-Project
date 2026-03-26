import type { ProductWithRelations } from "@/app/types/prisma";
import Link from "next/link";
import Image from "next/image";

const ProductCard = ({ product }: { product: ProductWithRelations }) => {
	const images = (product.images as string[]) || [];
	const image = product.thumbnail || images[0] || "";

	return (
		<Link href={`/product/${product.id}`} className="group cursor-pointer">
			<div className="aspect-3/4 overflow-hidden bg-surface-container-low mb-6 relative">
				<Image
					className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
					alt={product.title}
					src={image}
					fill
					sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
				/>
				<div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
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
		</Link>
	);
};

export default ProductCard;

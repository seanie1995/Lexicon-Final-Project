import type { ProductWithRelations } from "@/app/types/prisma";
import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "@/lib/formatters";

const ProductCard = ({ product }: { product: ProductWithRelations }) => {
	const images = (product.images as string[]) || [];
	const image = product.thumbnail || images[0] || "";

	return (
		<Link href={`/product/${product.id}`} className="group cursor-pointer block relative">
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
						{formatPrice(product.price)} SEK
					</span>
				</div>
				<p className="font-body italic text-secondary">{product.author.name}</p>
		{/* 
    Card metadata — year, condition and a 
    couple of tags to give the reader a feel 
    for the book without overwhelming them.
    Full tag list lives on the detail page.
*/}
<div className="flex items-center gap-2 pt-2 flex-wrap">

    {/* Publication year */}
    <span className="font-label text-[10px] uppercase tracking-widest px-2 py-1 bg-surface-container-highest text-secondary">
        {new Date(product.year).getFullYear()}
    </span>

    {/* Physical condition of this copy */}
    <span className="font-label text-[10px] uppercase tracking-widest px-2 py-1 bg-surface-container-highest text-secondary">
        {product.condition.grade}
    </span>

    {/* 
        Show max 2 tags as a preview.
        Slicing to 2 keeps the card clean —
        too many tags made it feel cluttered.
    */}
    {Array.isArray(product.tags) && 
        (product.tags as string[]).slice(0, 2).map((tag, index) => (
            <span
                key={index}
                className="font-label text-[10px] uppercase tracking-widest px-2 py-1 bg-primary/10 text-primary border border-primary/20"
            >
                {tag}
            </span>
        ))
    }
</div>
			</div>
		</Link>
	);
};

export default ProductCard;

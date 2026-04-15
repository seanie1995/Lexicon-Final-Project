import Image from "next/image";
import Link from "next/link";
import type { ProductWithRelations } from "@/app/types/prisma";
import { formatPrice } from "@/lib/formatters";

const ProductCard = ({ product }: { product: ProductWithRelations }) => {
  const images = (product.images as string[]) || [];
  const image = product.thumbnail || images[0] || "";

  const available = product.availabilityStatus === "Sold" ? false : true;

  return (
    <Link
      href={`/product/${product.id}`}
      aria-label={`View details for ${product.title} by ${product.author.name}`}
      className="group block relative focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
    >
      <div className="aspect-3/4 overflow-hidden bg-surface-container-low mb-6 relative">
        <Image
          className="w-full h-full object-cover"
          alt={`${product.title} by ${product.author.name}`}
          src={image}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />

        {/* SOLD overlay */}
        {!available && (
          <div
            className="absolute inset-0 flex items-center justify-center bg-black/30"
            aria-label="This item is sold"
          >
            <span className="bg-red-600 px-3 py-1 font-label text-xs text-white font-semibold tracking-widest opacity-60">
              SOLD
            </span>
          </div>
        )}

        {/* Hover overlay (decorative only) */}
        <div
          className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity"
          aria-hidden="true"
        />
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-start gap-4">
          <h3 className="font-headline text-xl text-on-surface leading-tight group-hover:text-primary transition-colors">
            {product.title}
            {!available && (
              <span className="text-on-surface-variant font-semibold ml-2">
                (SOLD)
              </span>
            )}
          </h3>

          <span className="font-label text-sm text-primary font-semibold whitespace-nowrap">
            {formatPrice(product.price)} SEK
          </span>
        </div>

        <p className="font-body italic text-secondary">
          {product.author.name}
        </p>

        <div className="flex items-center gap-2 pt-2 flex-wrap">
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
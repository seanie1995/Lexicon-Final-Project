import Image from "next/image";
import Link from "next/link";
import type { ProductWithRelations } from "@/app/types/prisma";
import { formatPrice } from "@/lib/formatters";
import AddToCartButton from "@/components/add-to-cart-button";

interface NewArrivalCardProps {
  product: ProductWithRelations;
  reverse?: boolean;
}

const NewArrivalCard = ({ product, reverse = false }: NewArrivalCardProps) => {
  const images = (product.images as string[]) || [];
  const image = product.thumbnail || images[0] || "";
  const isAvailable = product.availabilityStatus === "Sold" ? false : true;

  return (
    <article
      className={`flex flex-col items-center gap-12 ${
        reverse ? "md:flex-row-reverse" : "md:flex-row"
      }`}
    >
      <Link
        href={`/product/${product.id}`}
        className="group relative w-full overflow-hidden bg-surface-container-low md:w-1/3 aspect-3/4"
      >
        <Image
          src={image}
          alt={product.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      </Link>

      <div className="flex-1 space-y-4">
        <p className="font-label text-[10px] font-bold uppercase tracking-widest text-primary">
          Reference #AR-{product.id.toString().padStart(4, "0")}
        </p>
        <h3 className="font-headline text-3xl font-bold text-on-surface">
          {product.title} ({new Date(product.year).getFullYear()})
        </h3>
        <p className="leading-relaxed text-on-surface-variant">
          {product.description}
        </p>
        <div className="flex items-center gap-8 pt-4">
          <span className="font-body text-xl">
            {formatPrice(product.price)} SEK
          </span>
          <AddToCartButton
            product={product}
            size="sm"
            available={isAvailable}
          />
        </div>
      </div>
    </article>
  );
};

export default NewArrivalCard;

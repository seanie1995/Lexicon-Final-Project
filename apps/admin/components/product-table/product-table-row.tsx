import Image from "next/image";
import { Edit } from "lucide-react";
import type { ProductWithRelations } from "@/lib/types/product";
import { DeleteButton } from "@/components/form/delete-button";
import Link from "next/link";

interface ProductTableRowProps {
  product: ProductWithRelations;
}

function getStatusClasses(status: string | undefined): string {
  const normalized = status?.toLowerCase();
  if (normalized === "in stock") return "text-green-600";
  if (normalized === "low stock") return "text-yellow-600";
  if (normalized === "out of stock") return "text-red-600";
  return "text-neutral-600";
}

export default function ProductTableRow({ product }: ProductTableRowProps) {
  const formattedPrice = Math.round(product.price).toLocaleString("sv-SE");
  const imageUrl = Array.isArray(product.images) && product.images.length > 0
    ? (product.images[0] as string)
    : product.thumbnail;

  return (
    <tr className="text-center hover:bg-neutral-50">
      <td className="p-4">
        <Image
          src={imageUrl || "/placeholder.png"}
          alt={product.title}
          width={40}
          height={40}
          className="rounded object-cover"
        />
      </td>
      <td className="p-4 text-left">
        <div className="font-medium text-neutral-900">{product.title}</div>
        <div className="text-xs text-neutral-500">{product.author?.name}</div>
      </td>
      <td className="p-4 text-neutral-600">{product.category?.name}</td>
      <td className="p-4 font-medium text-neutral-900">{formattedPrice} kr</td>
      <td className="p-4 text-neutral-600">{product.condition?.grade}</td>
      <td className="p-4">
        <span className={`text-xs font-medium ${getStatusClasses(product.availabilityStatus)}`}>
          {product.availabilityStatus}
        </span>
      </td>
      <td className="p-4">
        <div className="flex gap-1 justify-center">
          <Link
            href={`/products/edit/${product.id}`}
            className="p-1.5 rounded-md hover:bg-neutral-100 text-purple-600 cursor-pointer"
          >
            <Edit size={16} />
          </Link>
          <DeleteButton id={product.id} />
        </div>
      </td>
    </tr>
  );
}

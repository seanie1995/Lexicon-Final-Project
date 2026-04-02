import type { Product } from "@/lib/types/product";
import ProductTableRow from "./product-table-row";

interface ProductsTableProps {
  products: Product[];
}

export default function ProductTable({ products }: ProductsTableProps) {
  return (
      <table className="w-full">
        <thead className="border-b border-neutral-200">
          <tr className="bg-neutral-50">
            <th className="p-4"></th>
            <th className="p-4 text-xs text-neutral-500">Product</th>
            <th className="p-4 text-xs text-neutral-500">Category</th>
            <th className="p-4 text-xs text-neutral-500">Price</th>
            <th className="p-4 text-xs text-neutral-500">Stock</th>
            <th className="p-4 text-xs text-neutral-500">Status</th>
            <th className="p-4 text-xs text-neutral-500 text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-200 bg-white">
          {products.map((product) => (
            <ProductTableRow key={product.id} product={product} />
          ))}
        </tbody>
      </table>
  );
}

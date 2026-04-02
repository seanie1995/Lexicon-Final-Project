import type { Product } from "@/lib/types/product";
import EditProductForm from "@/components/form/edit-product-form";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const API_URL = process.env.API_URL || "http://localhost:3000";
  const res = await fetch(`${API_URL}/products/${id}`);

  if (!res.ok)
    return (
      <h1>Couldn't not find product, make sure the product id is valid!</h1>
    );

  const product = (await res.json()) as Product;

  return (
    <div>
      <h1 className="font-bold font-xl md:font-2xl">Edit: {product.title}</h1>
      {/* Edit form */}
      <EditProductForm product={product} />
    </div>
  );
}

import EditProductForm from "@/components/form/edit-product-form";
import { getProductById } from "@/lib/actions/products";
import { getCategories, getConditions, getAuthors, getPublishers } from "@/lib/actions/lookups";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [product, categories, conditions, authors, publishers] = await Promise.all([
    getProductById(parseInt(id, 10)),
    getCategories(),
    getConditions(),
    getAuthors(),
    getPublishers(),
  ]);

  if (!product) {
    return <h1>Product not found</h1>;
  }

  return (
    <div>
      <h1 className="font-bold text-xl md:text-2xl">Edit: {product.title}</h1>
      <EditProductForm
        product={product}
        categories={categories}
        conditions={conditions}
        authors={authors}
        publishers={publishers}
      />
    </div>
  );
}

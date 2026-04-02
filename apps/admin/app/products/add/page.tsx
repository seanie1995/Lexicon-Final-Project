import AddProductForm from "@/components/form/add-product-form";
import { getCategories, getConditions, getAuthors, getPublishers } from "@/lib/actions/lookups";

export default async function AddProductPage() {
  const [categories, conditions, authors, publishers] = await Promise.all([
    getCategories(),
    getConditions(),
    getAuthors(),
    getPublishers(),
  ]);

  return (
    <div className="container mx-auto">
      <h1 className="mb-6 text-xl font-semibold md:text-2xl">Add New Product</h1>
      <AddProductForm
        categories={categories}
        conditions={conditions}
        authors={authors}
        publishers={publishers}
      />
    </div>
  );
}

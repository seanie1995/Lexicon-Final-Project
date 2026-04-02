import AddProductForm from "@/components/form/add-product-form";

export default function AddProductPage() {
  return (
    <div className="container mx-auto">
      <h1 className="mb-6 text-xl font-semibold md:text-2xl">
        Add New Product
      </h1>
      <AddProductForm />
    </div>
  );
}

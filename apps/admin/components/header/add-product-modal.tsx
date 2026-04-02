"use client";

import AddProductForm from "../form/add-product-form";
import type { Category, Condition, Author, Publisher } from "@/lib/types/product";

type AddProductModalProps = {
  onClose: () => void;
  categories: Category[];
  conditions: Condition[];
  authors: Author[];
  publishers: Publisher[];
};

export default function AddProductModal({
  onClose,
  categories,
  conditions,
  authors,
  publishers,
}: AddProductModalProps) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white p-6 rounded-xl w-96 shadow-lg">
        <h2 className="text-xl font-semibold mb-6">Add new product</h2>
        <AddProductForm
          categories={categories}
          conditions={conditions}
          authors={authors}
          publishers={publishers}
        />
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 rounded-lg border"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

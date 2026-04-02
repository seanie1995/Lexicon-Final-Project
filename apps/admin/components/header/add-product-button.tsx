"use client";

import { useState } from "react";
import AddProductModal from "./add-product-modal";
import type { Category, Condition, Author, Publisher } from "@/lib/types/product";

type Props = {
  categories: Category[];
  conditions: Condition[];
  authors: Author[];
  publishers: Publisher[];
};

export default function AddProductButton({
  categories,
  conditions,
  authors,
  publishers,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="bg-purple-900/80 text-white px-4 py-2.5 rounded-lg hover:bg-purple-900/85 transition cursor-pointer"
      >
        + Add product
      </button>
      {isOpen && (
        <AddProductModal
          onClose={() => setIsOpen(false)}
          categories={categories}
          conditions={conditions}
          authors={authors}
          publishers={publishers}
        />
      )}
    </>
  );
}

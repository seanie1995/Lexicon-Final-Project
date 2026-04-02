"use client";

import { useState } from "react";
import AddProductModal from "./add-product-modal";

export default function AddProductButton() {
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

      {/* if isOpen = true, set isOpen to false on close  */}
      {isOpen && <AddProductModal onClose={() => setIsOpen(false)} />}
    </>
  );
}


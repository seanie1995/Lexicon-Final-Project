"use client";

import React from "react";
import { useCart } from "@/lib/contexts/cart-context";
import type { ProductWithRelations } from "@/app/types/prisma";
import { ShoppingBag, Check } from "lucide-react";

interface AddToCartButtonProps {
  product: ProductWithRelations;
}

const AddToCartButton = ({ product }: AddToCartButtonProps) => {
  const { addToCart, isInCart } = useCart();
  const inCart = isInCart(product.id);

  return (
    <button
      type="button"
      disabled={inCart}
      onClick={() => addToCart(product)}
      className={`w-full py-5 font-label font-bold tracking-widest transition-all duration-300 flex items-center justify-center gap-3 ${inCart
          ? "bg-surface-container-highest text-secondary cursor-default"
          : "bg-primary text-on-primary hover:bg-primary-container hover:shadow-lg cursor-pointer"
        }`}
    >
      {inCart ? (
        <>
          <Check className="w-5 h-5" />
          IN CART
        </>
      ) : (
        <>
          <ShoppingBag className="w-5 h-5" />
          ADD TO CART
        </>
      )}
    </button>
  );
};

export default AddToCartButton;

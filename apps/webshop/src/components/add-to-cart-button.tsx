"use client";

import React from "react";
import { useCart } from "@/lib/contexts/cart-context";
import type { ProductWithRelations } from "@/app/types/prisma";
import { ShoppingBag, Check } from "lucide-react";

interface AddToCartButtonProps {
  product: ProductWithRelations;
  size?: "default" | "sm";
}

const AddToCartButton = ({ product, size = "default" }: AddToCartButtonProps) => {
  const { addToCart, isInCart } = useCart();
  const inCart = isInCart(product.id);

  const sizeClasses =
    size === "sm"
      ? "px-6 py-3 text-xs"
      : "w-full py-5";

  return (
    <button
      type="button"
      disabled={inCart}
      onClick={() => addToCart(product)}
      className={`font-label font-bold tracking-widest transition-all duration-300 flex items-center justify-center gap-3 ${sizeClasses} ${inCart
          ? "bg-surface-container-highest text-secondary cursor-default"
          : "bg-primary text-on-primary hover:bg-primary-container hover:shadow-lg cursor-pointer"
        }`}
    >
      {inCart ? (
        <>
          <Check className={size === "sm" ? "w-4 h-4" : "w-5 h-5"} />
          IN CART
        </>
      ) : (
        <>
          <ShoppingBag className={size === "sm" ? "w-4 h-4" : "w-5 h-5"} />
          ADD TO CART
        </>
      )}
    </button>
  );
};

export default AddToCartButton;

"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import type { ProductWithRelations } from "@/app/types/prisma";
import type { CartContextType } from "@/app/types/cart";

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<ProductWithRelations[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // One-time load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("cart");
    if (saved) {
      try {
        setCartItems(JSON.parse(saved));
      } catch (e) {
        console.error("Cart hydration failed:", e);
      }
    }
  }, []);

  // Sync to localStorage whenever cartItems changes
  // Note: We only want to save after the initial load, but a simple effect is fine for "basic"
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product: ProductWithRelations) => {
    if (!isInCart(product.id)) {
      setCartItems((prev) => [...prev, product]);
      setIsCartOpen(true);
    }
  };

  const removeFromCart = (id: number) => setCartItems((prev) => prev.filter((i) => i.id !== id));
  const clearCart = () => setCartItems([]);
  const isInCart = (id: number) => cartItems.some((i) => i.id === id);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        clearCart,
        isInCart,
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};

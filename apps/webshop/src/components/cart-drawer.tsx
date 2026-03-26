"use client";

import React from "react";
import { X, Trash2, ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/contexts/cart-context";
import Image from "next/image";

const CartDrawer = () => {
  const { cartItems, removeFromCart, isCartOpen, setIsCartOpen, clearCart } = useCart();

  if (!isCartOpen) return null;

  const total = cartItems.reduce((acc, item) => acc + item.price, 0);

  return (
    <div className="fixed inset-0 z-100 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="absolute inset-y-0 right-0 flex max-w-full">
        <div className="w-screen max-w-md transform transition-transform duration-500 ease-in-out">
          <div className="flex h-full flex-col bg-[#fffaf0] shadow-2xl border-l border-primary/10">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-8 border-b border-primary/5">
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-5 h-5 text-primary" />
                <h2 className="text-2xl font-serif italic text-primary">Your Cart</h2>
              </div>
              <button
                type="button"
                className="p-2 -mr-2 text-secondary hover:text-primary transition-colors"
                onClick={() => setIsCartOpen(false)}
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto px-6 py-8">
              {cartItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-surface-container-low flex items-center justify-center">
                    <ShoppingBag className="w-8 h-8 text-secondary/30" />
                  </div>
                  <p className="font-body text-secondary italic">Your archive is currently empty.</p>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="font-label text-sm uppercase tracking-widest text-primary hover:underline"
                  >
                    Return to Catalog
                  </button>
                </div>
              ) : (
                <ul className="space-y-8">
                  {cartItems.map((item) => {
                    const images = (item.images as string[]) || [];
                    const image = item.thumbnail || images[0] || "";
                    return (
                      <li key={item.id} className="flex gap-6 group">
                        <div className="relative h-32 w-24 shrink-0 overflow-hidden bg-surface-container-low">
                          <Image
                            src={image}
                            alt={item.title}
                            fill
                            className="object-cover"
                            sizes="96px"
                          />
                        </div>
                        <div className="flex flex-1 flex-col justify-between py-1">
                          <div>
                            <div className="flex justify-between items-start gap-4">
                              <h3 className="font-headline text-lg text-on-surface leading-snug">
                                {item.title}
                              </h3>
                              <p className="font-label text-sm font-semibold text-primary whitespace-nowrap">
                                {item.price.toLocaleString()} SEK
                              </p>
                            </div>
                            <p className="font-body text-sm italic text-secondary mt-1">
                              {item.author.name}
                            </p>
                            <div className="flex gap-2 mt-2">
                              <span className="font-label text-[10px] uppercase tracking-widest px-2 py-0.5 bg-surface-container-highest text-secondary">
                                {item.condition.grade}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center justify-end">
                            <button
                              type="button"
                              onClick={() => removeFromCart(item.id)}
                              className="font-label text-[10px] uppercase tracking-widest text-secondary hover:text-error flex items-center gap-1.5 transition-colors"
                            >
                              <Trash2 className="w-3 h-3" />
                              Remove
                            </button>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            {/* Footer */}
            {cartItems.length > 0 && (
              <div className="border-t border-primary/10 px-6 py-10 bg-surface-container-low">
                <div className="flex justify-between items-baseline mb-8">
                  <p className="font-label text-sm uppercase tracking-widest text-secondary">Total Cart Value</p>
                  <p className="text-2xl font-headline text-primary font-bold">{total.toLocaleString()} SEK</p>
                </div>
                <div className="space-y-4">
                  <button
                    className="w-full bg-primary text-on-primary py-4 font-label uppercase tracking-widest hover:bg-primary/90 transition-all font-bold shadow-lg"
                  >
                    Proceed to Checkout
                  </button>
                  <button
                    onClick={() => clearCart()}
                    className="w-full text-secondary py-2 font-label text-[10px] uppercase tracking-[0.2em] hover:text-primary transition-colors"
                  >
                    Clear All Items
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartDrawer;

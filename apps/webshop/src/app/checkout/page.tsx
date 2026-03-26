"use client";

import React from "react";
import { useCart } from "@/lib/contexts/cart-context";
import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, ArrowLeft, Truck, ShieldCheck, CreditCard } from "lucide-react";
import { formatPrice } from "@/lib/formatters";

export default function CheckoutPage() {
  const { cartItems, removeFromCart } = useCart();
  const subtotal = cartItems.reduce((acc, item) => acc + item.price, 0);
  const shipping = 0; // Free shipping
  const total = subtotal + shipping;

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen pt-32 pb-20 px-8 flex flex-col items-center justify-center bg-background">
        <div className="text-center max-w-md space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="mx-auto w-20 h-20 rounded-full bg-surface-container-low flex items-center justify-center border border-primary/5 shadow-inner">
            <ShoppingBag className="w-10 h-10 text-primary/30" />
          </div>
          <div className="space-y-4">
            <h1 className="text-4xl font-headline italic text-primary">Your cart is empty</h1>
            <p className="font-body text-secondary leading-relaxed">
              Before you can proceed to checkout, you'll need to add some treasures to your collection.
            </p>
          </div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-label text-sm uppercase tracking-widest text-primary hover:gap-4 transition-all group"
          >
            <ArrowLeft className="w-4 h-4" />
            Return to Catalog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-20 bg-background">
      <div className="max-w-screen-2xl mx-auto px-8">
        <header className="mb-16 animate-in fade-in slide-in-from-left-4 duration-700">
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-label text-[10px] uppercase tracking-[0.2em] text-secondary hover:text-primary mb-6 transition-colors"
          >
            <ArrowLeft className="w-3 h-3" />
            Continue Browsing
          </Link>
          <h1 className="text-5xl font-headline italic text-primary">Finalizing Your Order</h1>
          <p className="font-body text-secondary mt-4">Review your selected items and proceed to secure payment.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
          {/* Items Section */}
          <div className="lg:col-span-7 space-y-12">
            <div className="space-y-8">
              {cartItems.map((item, index) => {
                const images = (item.images as string[]) || [];
                const image = item.thumbnail || images[0] || "";
                return (
                  <div
                    key={`${item.id}-${index}`}
                    className="flex gap-8 group animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-both"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="relative h-48 w-36 shrink-0 overflow-hidden bg-surface-container-low shadow-sm border border-primary/5">
                      <Image
                        src={image}
                        alt={item.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 144px, 144px"
                      />
                    </div>
                    <div className="flex flex-1 flex-col py-2">
                      <div className="flex justify-between items-start gap-4">
                        <div className="space-y-2">
                          <h3 className="font-headline text-2xl text-on-surface leading-tight decoration-primary/10 group-hover:underline underline-offset-4 decoration-1">
                            {item.title}
                          </h3>
                          <p className="font-body text-lg italic text-secondary">{item.author.name}</p>
                        </div>
                        <p className="font-headline text-xl text-primary font-bold">
                          {formatPrice(item.price)} SEK
                        </p>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-3">
                        <span className="font-label text-[10px] uppercase tracking-widest px-3 py-1 bg-surface-container-high text-secondary border border-primary/5">
                          {item.condition.grade} Condition
                        </span>
                        <span className="font-label text-[10px] uppercase tracking-widest px-3 py-1 bg-surface-container-high text-secondary border border-primary/5 flex items-center gap-2">
                          <Truck className="w-3 h-3 opacity-50" />
                          {item.shippingInformation}
                        </span>
                      </div>

                      <div className="mt-auto flex justify-end">
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="font-label text-[10px] uppercase tracking-[0.2em] text-secondary hover:text-error transition-colors flex items-center gap-2"
                        >
                          Remove item from bag
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Sidebar / Summary */}
          <div className="lg:col-span-5">
            <div className="sticky top-40 space-y-8 animate-in fade-in slide-in-from-right-4 duration-700">
              <div className="bg-[#fffdfa] border border-primary/10 p-10 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 -mr-16 -mt-16 rounded-full blur-2xl" />

                <h2 className="font-headline text-2xl italic text-primary mb-8 border-b border-primary/10 pb-4">
                  Order Summary
                </h2>

                <div className="space-y-6">
                  <div className="flex justify-between items-center text-secondary">
                    <span className="font-label text-xs uppercase tracking-widest">Subtotal</span>
                    <span className="font-body font-medium">{formatPrice(subtotal)} SEK</span>
                  </div>

                    <div className="flex justify-between items-center text-secondary border-b border-primary/5 pb-6">
                    <div className="flex flex-col">
                      <span className="font-label text-xs uppercase tracking-widest">Premium Shipping</span>
                      <span className="text-[10px] italic text-secondary/60 mt-1">Insured delivery with tracking</span>
                    </div>
                    <span className="font-label text-xs uppercase tracking-widest text-[#2d5a27] font-bold">Complimentary</span>
                  </div>

                  <div className="flex justify-between items-baseline pt-4">
                    <span className="font-label text-sm uppercase tracking-[0.2em] text-primary font-bold">Total Amount</span>
                    <span className="text-3xl font-headline text-primary font-bold">{formatPrice(total)} SEK</span>
                  </div>
                </div>

                <div className="mt-10 space-y-4">
                  <button className="w-full bg-primary text-on-primary py-5 font-label font-bold uppercase tracking-[0.25em] hover:bg-primary/95 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-3">
                    <CreditCard className="w-5 h-5" />
                    Proceed to Payment
                  </button>
                  <p className="text-center font-label text-[10px] text-secondary/70 italic max-w-[280px] mx-auto leading-relaxed">
                    You will be redirected to <span className="font-bold text-primary not-italic">Stripe</span> for a secure payment experience. Shipping and billing address details will be collected there.
                  </p>
                </div>
              </div>

              {/* Trust markers */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-surface-container-low p-6 flex flex-col items-center text-center space-y-3 border border-primary/5 shadow-sm">
                  <ShieldCheck className="w-6 h-6 text-primary/40" />
                  <p className="font-label text-[9px] uppercase tracking-widest text-secondary">Secure SSL Encryption</p>
                </div>
                <div className="bg-surface-container-low p-6 flex flex-col items-center text-center space-y-3 border border-primary/5 shadow-sm">
                  <Truck className="w-6 h-6 text-primary/40" />
                  <p className="font-label text-[9px] uppercase tracking-widest text-secondary">Insured Worldwide Delivery</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

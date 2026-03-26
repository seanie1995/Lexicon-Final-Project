"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, User, ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/contexts/cart-context";
import CartDrawer from "./cart-drawer";

const navLinks = [
  { label: "Catalog", href: "/catalog" },
  { label: "Rarities", href: "/" },
  { label: "Chronology", href: "/" },
  { label: "Curations", href: "/" },
];

const Header = () => {
  const pathname = usePathname();
  const { cartItems, setIsCartOpen } = useCart();

  return (
    <>
      <nav className="fixed top-0 w-full z-50 rounded-none bg-[#fff9eb]/85 backdrop-blur-md border-b border-primary/5 shadow-sm">
        <div className="flex justify-between items-center w-full px-8 py-6 max-w-screen-2xl mx-auto">
          <Link href="/" className="text-2xl font-serif italic text-primary">
            The Digital Archivist
          </Link>

          <div className="hidden md:flex gap-10 font-headline serif tracking-tight">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`${isActive
                      ? "text-primary font-bold border-b border-primary pb-1"
                      : "text-secondary font-medium"
                    } hover:text-primary transition-colors duration-300`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-6 text-primary">
            <div className="hidden lg:flex items-center bg-surface-container-low px-4 py-2">
              <Search className="w-4 h-4 mr-2" />
              <input
                className="bg-transparent border-none focus:ring-0 text-sm font-label italic placeholder:text-outline/50 w-48"
                placeholder="Search the archives..."
                type="text"
              />
            </div>

            <User className="w-5 h-5 cursor-pointer hover:text-primary transition-colors" />
            <div className="relative cursor-pointer group" onClick={() => setIsCartOpen(true)}>
              <ShoppingBag className="w-5 h-5 group-hover:text-primary transition-colors" />
              {cartItems.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-primary text-on-primary text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-in zoom-in-50 duration-300">
                  {cartItems.length}
                </span>
              )}
            </div>
          </div>
        </div>
      </nav>
      <CartDrawer />
    </>
  );
};

export default Header;

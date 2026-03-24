"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, User, ShoppingBag } from "lucide-react";

const navLinks = [
  { label: "Catalog", href: "/" },
  { label: "Rarities", href: "/" },
  { label: "Chronology", href: "/" },
  { label: "Curations", href: "/" },
];

const Header = () => {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 w-full z-50 rounded-none bg-[#fff9eb]/85 backdrop-blur-md">
      <div className="flex justify-between items-center w-full px-8 py-6 max-w-screen-2xl mx-auto">
        <Link href="/" className="text-2xl font-serif italic text-[#4f1819]">
          The Digital Archivist
        </Link>

        <div className="hidden md:flex gap-10 font-headline serif tracking-tight">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.label}
                href={link.href}
                className={`${
                  isActive
                    ? "text-[#4f1819] font-bold border-b border-[#4f1819] pb-1"
                    : "text-[#725a42] font-medium"
                } hover:text-[#4f1819] transition-colors duration-300`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-6 text-[#4f1819]">
          <div className="hidden lg:flex items-center bg-surface-container-low px-4 py-2">
            <Search className="w-4 h-4 mr-2" />
            <input
              className="bg-transparent border-none focus:ring-0 text-sm font-label italic placeholder:text-outline/50 w-48"
              placeholder="Search the archives..."
              type="text"
            />
          </div>

          <User className="w-5 h-5 cursor-pointer" />
          <ShoppingBag className="w-5 h-5 cursor-pointer" />
        </div>
      </div>
    </nav>
  );
};

export default Header;

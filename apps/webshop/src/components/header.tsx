"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Search, User, ShoppingBag, LogOut, Loader2 } from "lucide-react";

const navLinks = [
  { label: "Catalog", href: "/" },
  { label: "Rarities", href: "/" },
  { label: "Chronology", href: "/" },
  { label: "Curations", href: "/" },
];

const Header = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
    } catch {
      console.error("Logout failed");
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <nav className="fixed top-0 w-full z-50 rounded-none bg-[#fff9eb]/85 backdrop-blur-md">
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
                className={`${
                  isActive
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

          <User className="w-5 h-5 cursor-pointer" />
          <ShoppingBag className="w-5 h-5 cursor-pointer" />

          <button
            type="button"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="flex items-center gap-1 text-primary hover:text-on-primary hover:bg-primary px-3 py-1.5 transition-colors duration-300 disabled:opacity-50"
            title="Logout"
          >
            {isLoggingOut ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <LogOut className="w-5 h-5" />
            )}
            <span className="hidden xl:inline text-sm font-label">Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Header;

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Search, User, ShoppingBag, LogOut, LogIn, Loader2, Sun, Moon } from "lucide-react";
import { useCart } from "@/lib/contexts/cart-context";
import { useTheme } from "@/lib/contexts/theme-context";
import CartDrawer from "./cart-drawer";
import SearchInput from "./search-input";
import { createClient } from "@supabase-lib/supabase/client";

const navLinks = [
  { label: "Catalog", href: "/catalog" },
  { label: "Rarities", href: "/" },
  { label: "Chronology", href: "/" },
  { label: "Curations", href: "/" },
];

const Header = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { cartItems, setIsCartOpen } = useCart();
  const { theme, toggleTheme } = useTheme();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();

    // Get the initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUserEmail(session?.user?.email ?? null);
    });

    // Subscribe to auth state changes (login / logout)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserEmail(session?.user?.email ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      // Sync the sign-out to the browser client so onAuthStateChange fires
      // immediately and the header updates without waiting for navigation.
      const supabase = createClient();
      await supabase.auth.signOut();
      router.push("/login");
    } catch {
      console.error("Logout failed");
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <>
      <nav className="fixed top-0 w-full z-50 rounded-none bg-surface/85 backdrop-blur-md border-b border-primary/5 shadow-sm">
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

          {/* Search input — now a separate client component */}
          <div className="flex items-center gap-6 text-primary">

            <button
              type="button"
              onClick={toggleTheme}
              className="p-1 hover:text-primary/70 transition-colors"
              aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            >
              {theme === "dark" ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>

          {/* Search input — now a separate client component */}
          <SearchInput />

            {/* User icon + welcome message */}
            <Link href="/account" className="hidden xl:flex items-center gap-2">
              <User className="w-5 h-5" />
              {userEmail && (
                <span className="text-sm font-label text-secondary truncate max-w-[180px]" title={userEmail}>
                  Welcome, {userEmail.split("@")[0]}
                </span>
              )}
            </Link>

            {/* Show icon-only on smaller screens */}
            <Link href="/account">
              <User className="xl:hidden w-5 h-5 cursor-pointer hover:text-primary transition-colors" />
            </Link>
            <div
              className="relative cursor-pointer group"
              onClick={() => setIsCartOpen(true)}
            >
              <ShoppingBag className="w-5 h-5 group-hover:text-primary transition-colors" />
              {cartItems.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-primary text-on-primary text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-in zoom-in-50 duration-300">
                  {cartItems.length}
                </span>
              )}
            </div>

            {/* Login / Logout button */}
            {userEmail ? (
              <button
                type="button"
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="flex items-center gap-1 px-3 py-1.5 hover:bg-primary hover:text-on-primary transition-colors duration-300 disabled:opacity-50"
                title="Logout"
              >
                {isLoggingOut ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <LogOut className="w-5 h-5" />
                )}
                <span className="hidden xl:inline text-sm font-label">Logout</span>
              </button>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-1 px-3 py-1.5 hover:bg-primary hover:text-on-primary transition-colors duration-300"
                title="Login"
              >
                <LogIn className="w-5 h-5" />
                <span className="hidden xl:inline text-sm font-label">Login</span>
              </Link>
            )}
          </div>
        </div>
      </nav>
      <CartDrawer />
    </>
    
  );
};

export default Header;

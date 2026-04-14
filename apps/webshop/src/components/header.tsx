"use client";

import { createClient } from "@supabase-lib/supabase/client";
import {
	Loader2,
	LogIn,
	LogOut,
	Menu,
	Moon,
	Search,
	ShoppingBag,
	Sun,
	User,
	X,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { useCart } from "@/lib/contexts/cart-context";
import { useTheme } from "@/lib/contexts/theme-context";
import CartDrawer from "./cart-drawer";
import SearchInput from "./search-input";

const navLinks = [
	{ label: "Home", href: "/" },
	{ label: "Catalog", href: "/catalog" },
	{ label: "Contact", href: "/contact" },
	{ label: "Shipping", href: "/shipping" },
	{ label: "Journal", href: "/journal" },
];

const Header = () => {
	const pathname = usePathname();
	const router = useRouter();
	const { cartItems, setIsCartOpen } = useCart();
	const { theme, toggleTheme } = useTheme();
	const [isLoggingOut, setIsLoggingOut] = useState(false);
	const [userEmail, setUserEmail] = useState<string | null>(null);
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	// Close mobile menu on route change
	useEffect(() => {
		setIsMenuOpen(false);
	}, [pathname]);

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
				<div className="flex justify-between items-center w-full px-4 md:px-8 py-6 max-w-screen-2xl mx-auto">
					<Link
						href="/"
						className="text-xl md:text-2xl font-serif italic text-primary shrink-0"
					>
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

					{/* Right side: icons + hamburger */}
					<div className="flex items-center gap-3 text-primary">
						{/* Hamburger toggle — visible on mobile only */}
						<button
							type="button"
							className="md:hidden p-1 hover:text-primary/70 transition-colors"
							onClick={() => setIsMenuOpen(!isMenuOpen)}
							aria-label={isMenuOpen ? "Close menu" : "Open menu"}
						>
							{isMenuOpen ? (
								<X className="w-6 h-6" />
							) : (
								<Menu className="w-6 h-6" />
							)}
						</button>

						{/* Search input — now a separate client component */}
						<Suspense fallback={<div className="w-10 h-10" />}>
							<SearchInput />
						</Suspense>

						<button
							type="button"
							onClick={toggleTheme}
							className="p-1 hover:text-primary/70 transition-colors"
							aria-label={
								theme === "dark"
									? "Switch to light mode"
									: "Switch to dark mode"
							}
							title={
								theme === "dark"
									? "Switch to light mode"
									: "Switch to dark mode"
							}
						>
							{theme === "dark" ? (
								<Sun className="w-5 h-5" />
							) : (
								<Moon className="w-5 h-5" />
							)}
						</button>

						{/* User icon + welcome message */}
						<Link href="/account" className="hidden xl:flex items-center gap-2">
							<User className="w-5 h-5" />
							{userEmail && (
								<span
									className="text-sm font-label text-secondary truncate max-w-45"
									title={userEmail}
								>
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
								<span className="hidden xl:inline text-sm font-label">
									Logout
								</span>
							</button>
						) : (
							<Link
								href="/login"
								className="flex items-center gap-1 px-3 py-1.5 hover:bg-primary hover:text-on-primary transition-colors duration-300"
								title="Login"
							>
								<LogIn className="w-5 h-5" />
								<span className="hidden xl:inline text-sm font-label">
									Login
								</span>
							</Link>
						)}
					</div>
				</div>

				{/* Mobile nav panel */}
				<div
					className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
						isMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
					}`}
				>
					<div className="flex flex-col gap-1 px-4 pb-6 pt-2 border-t border-primary/5">
						{navLinks.map((link) => {
							const isActive = pathname === link.href;
							return (
								<Link
									key={link.label}
									href={link.href}
									className={`font-headline text-lg py-3 px-2 transition-colors duration-200 ${
										isActive
											? "text-primary font-bold"
											: "text-secondary hover:text-primary"
									}`}
								>
									{link.label}
								</Link>
							);
						})}
					</div>
				</div>
			</nav>

			{/* Overlay backdrop when mobile menu is open */}
			{isMenuOpen && (
				<div
					className="fixed inset-0 z-40 bg-on-surface/20 backdrop-blur-sm md:hidden"
					onClick={() => setIsMenuOpen(false)}
				/>
			)}

			<CartDrawer />
		</>
	);
};

export default Header;

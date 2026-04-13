"use client";

import { Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";

const SearchInput = () => {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const [isPending, startTransition] = useTransition();

	const pathnameRef = useRef(pathname);
	const searchParamsRef = useRef(searchParams);
	const initialized = useRef(false);
	pathnameRef.current = pathname;
	searchParamsRef.current = searchParams;

	const isCatalogPage = pathname.startsWith("/catalog");

	// Local state tracks what user is typing
	// We don't hit the URL on every keystroke
	const [inputValue, setInputValue] = useState(
		searchParams.get("search") ?? "",
	);

	useEffect(() => {
		if (!initialized.current) {
			initialized.current = true;
			return;
		}

		const debounceTimer = setTimeout(() => {
			if (!inputValue) return;

			const params = new URLSearchParams();
			params.set("search", inputValue);
			params.delete("page");

			startTransition(() => {
				router.push(`/catalog?${params.toString()}`);
			});
		}, 300);

		return () => clearTimeout(debounceTimer);
	}, [inputValue, router]);

	return (
		<div
			className={`
            hidden lg:flex items-center 
            bg-surface-container-low px-4 py-2 
            transition-opacity duration-200
            ${isPending ? "opacity-50" : "opacity-100"}
        `}
		>
			<Search className="w-4 h-4 mr-2 shrink-0 text-secondary" />
			<input
				className="bg-transparent border-none focus:ring-0 text-sm font-label italic placeholder:text-outline/50 w-48"
				placeholder="Search the archives..."
				type="text"
				value={inputValue}
				onChange={(e) => setInputValue(e.target.value)}
			/>
			{/* Show subtle spinner while results load */}
			{isPending && (
				<span className="ml-2 text-xs text-secondary animate-pulse">...</span>
			)}
		</div>
	);
};

export default SearchInput;

/*
    SearchInput — a client component that lives in the header.
    
    Why a separate component?
    Keeps search logic isolated and easy to find/edit later.
    
    How it works:
    User types → waits 300ms (debounce) → URL updates
    Page reads URL → passes to getProducts → Prisma filters
    
    Why debounce?
    Without it every keystroke triggers a database call.
    With it we wait until the user stops typing — 
    stops constant database calls!
    stops constant rendering after every keystroke; in other words,constant database call!!
*/

/*
            Debounce logic:
            Every time inputValue changes we set a timer.
            If user types again before 300ms — timer resets.
            Only when 300ms passes with no typing do we search.
        */

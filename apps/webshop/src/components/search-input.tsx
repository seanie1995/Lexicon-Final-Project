"use client";

import { Search } from "lucide-react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useTransition } from "react";

const SearchInput = () => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    
    // useTransition gives us a loading state while the page is fetching new results
    const [isPending, startTransition] = useTransition();

    const handleSearch = (term: string) => {

        /* Build a new URL with the search term.
        We keep existing params (like page, category) and just update the search value.
        */
        const params = new URLSearchParams(searchParams.toString());
        
        if (term) {
            params.set("search", term);
        } else {
            // So here, If search is empty, remove it from URL entirely
            params.delete("search");
        }
        
        // Reset to page 1 when searching
        params.delete("page");

        startTransition(() => {
            router.push(`${pathname}?${params.toString()}`);
        });
    };

    return (
        <div className={`hidden lg:flex items-center bg-surface-container-low px-4 py-2 transition-opacity ${isPending ? "opacity-50" : "opacity-100"}`}>
            <Search className="w-4 h-4 mr-2 shrink-0" />
            <input
                className="bg-transparent border-none focus:ring-0 text-sm font-label italic placeholder:text-outline/50 w-48"
                placeholder="Search the archives..."
                type="text"

                // Show current search value if URL has one
                defaultValue={searchParams.get("search") ?? ""}
                onChange={(e) => handleSearch(e.target.value)}
            />
        </div>
    );
};

export default SearchInput;



/*
    SearchInput — a client component that lives in the header.
    
    Why a separate component?
    The header is already "use client" but we want to keep 
    search logic isolated and easy to find/edit later.
    
    How it works:
    User types → URL updates with ?search=value
    Page reads URL → passes to getProducts → Prisma filters
    Same pattern as pagination!
*/
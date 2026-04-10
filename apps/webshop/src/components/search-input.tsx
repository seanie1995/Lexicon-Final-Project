"use client";

import { Search } from "lucide-react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useTransition, useEffect, useState } from "react";

const SearchInput = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // Local state tracks what user is typing
  // We don't hit the URL on every keystroke
  const [inputValue, setInputValue] = useState(
    searchParams.get("search") ?? "",
  );

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());

      if (inputValue) {
        params.set("search", inputValue);
      } else {
        params.delete("search");
      }

      // Always reset to page 1 on new search
      params.delete("page");

      startTransition(() => {
        router.push(`${pathname}?${params.toString()}`);
      });
    }, 300);

    // Cleanup — cancel timer if user types again
    return () => clearTimeout(debounceTimer);
  }, [inputValue]);

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

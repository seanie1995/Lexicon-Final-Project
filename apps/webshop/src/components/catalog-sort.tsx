"use client";

import { ChevronDown } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const SORT_OPTIONS = [
	{ value: "title-asc", label: "Title (A–Z)" },
	{ value: "title-desc", label: "Title (Z–A)" },
	{ value: "price-asc", label: "Price (Low → High)" },
	{ value: "price-desc", label: "Price (High → Low)" },
	{ value: "year-asc", label: "Year (Oldest first)" },
	{ value: "year-desc", label: "Year (Newest first)" },
	{ value: "author-asc", label: "Author (A–Z)" },
	{ value: "author-desc", label: "Author (Z–A)" },
];

const CatalogSort = () => {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	const currentSort = searchParams.get("sort") ?? "title-asc";

	const handleChange = (value: string) => {
		const next = new URLSearchParams(searchParams.toString());
		next.delete("page");

		if (value === "title-asc") {
			next.delete("sort");
		} else {
			next.set("sort", value);
		}

		const qs = next.toString();
		router.push(qs ? `${pathname}?${qs}` : pathname);
		router.refresh();
	};

	return (
		<div className="flex items-center gap-3">
			<label
				htmlFor="catalog-sort"
				className="font-label text-label-sm uppercase text-outline whitespace-nowrap"
			>
				Sort by
			</label>
			<div className="relative">
				<select
					id="catalog-sort"
					value={currentSort}
					onChange={(e) => handleChange(e.target.value)}
					className="cursor-pointer appearance-none border border-outline-variant/40 bg-surface-container-low px-4 py-2 pr-10 font-label text-sm text-secondary transition-colors hover:border-primary/40 focus:border-primary focus:outline-none"
				>
					{SORT_OPTIONS.map((option) => (
						<option key={option.value} value={option.value}>
							{option.label}
						</option>
					))}
				</select>
				<ChevronDown
					className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-outline"
					aria-hidden="true"
				/>
			</div>
		</div>
	);
};

export default CatalogSort;

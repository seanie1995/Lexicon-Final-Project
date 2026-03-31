"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type PageItem = { id: string; type: "page"; value: number } | { id: string; type: "ellipsis" };

function getPageRange(current: number, total: number): PageItem[] {
	const delta = 1;
	const items: PageItem[] = [];
	let ellipsisCount = 0;

	const left = Math.max(2, current - delta);
	const right = Math.min(total - 1, current + delta);

	items.push({ id: "page-1", type: "page", value: 1 });

	if (left > 2) items.push({ id: `ellipsis-${ellipsisCount++}`, type: "ellipsis" });

	for (let i = left; i <= right; i++) {
		items.push({ id: `page-${i}`, type: "page", value: i });
	}

	if (right < total - 1) items.push({ id: `ellipsis-${ellipsisCount++}`, type: "ellipsis" });

	if (total > 1) items.push({ id: `page-${total}`, type: "page", value: total });

	return items;
}

function buildPageHref(
	pathname: string,
	currentParams: URLSearchParams,
	page: number,
): string {
	const next = new URLSearchParams(currentParams.toString());

	if (page <= 1) {
		next.delete("page");
	} else {
		next.set("page", String(page));
	}

	const qs = next.toString();
	return qs ? `${pathname}?${qs}` : pathname;
}

const CatalogPagination = ({
	currentPage,
	totalPages,
}: {
	currentPage: number;
	totalPages: number;
}) => {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	if (totalPages <= 1) return null;

	const pages = getPageRange(currentPage, totalPages);
	const hasPrev = currentPage > 1;
	const hasNext = currentPage < totalPages;

	const handleNavigate = (page: number) => {
		const href = buildPageHref(pathname, searchParams, page);
		router.push(href);
		router.refresh();
	};

	return (
		<nav
			className="mt-16 flex items-center justify-center gap-2"
			aria-label="Catalog pagination"
		>
			<button
				type="button"
				disabled={!hasPrev}
				onClick={() => handleNavigate(currentPage - 1)}
				className="flex h-10 w-10 items-center justify-center border border-outline-variant/40 text-secondary transition-colors hover:border-primary/40 hover:text-primary disabled:pointer-events-none disabled:opacity-30"
				aria-label="Previous page"
			>
				<ChevronLeft className="h-4 w-4" />
			</button>

			{pages.map((item) =>
				item.type === "ellipsis" ? (
					<span
						key={item.id}
						className="flex h-10 w-10 items-center justify-center font-label text-sm text-outline"
					>
						&hellip;
					</span>
				) : (
					<button
						key={item.id}
						type="button"
						onClick={() => handleNavigate(item.value)}
						aria-current={item.value === currentPage ? "page" : undefined}
						className={`flex h-10 w-10 items-center justify-center border font-label text-sm transition-colors ${
							item.value === currentPage
								? "border-primary bg-primary text-on-primary"
								: "border-outline-variant/40 text-secondary hover:border-primary/40 hover:text-primary"
						}`}
					>
						{item.value}
					</button>
				),
			)}

			<button
				type="button"
				disabled={!hasNext}
				onClick={() => handleNavigate(currentPage + 1)}
				className="flex h-10 w-10 items-center justify-center border border-outline-variant/40 text-secondary transition-colors hover:border-primary/40 hover:text-primary disabled:pointer-events-none disabled:opacity-30"
				aria-label="Next page"
			>
				<ChevronRight className="h-4 w-4" />
			</button>
		</nav>
	);
};

export default CatalogPagination;

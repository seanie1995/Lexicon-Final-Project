// components/pagination/pagination.tsx
"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalProducts: number;
  productsPerPage: number;
}

export default function Pagination({
  currentPage,
  totalPages,
  totalProducts,
  productsPerPage,
}: PaginationProps) {
  const searchParams = useSearchParams();
  const [currentParams, setCurrentParams] = useState<string>("");

  const getPageNumbers = () => {
    const pages: number[] = [];
    const start = Math.max(1, currentPage - 2);
    const end = Math.min(totalPages, currentPage + 2);
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  const showingFrom = (currentPage - 1) * productsPerPage + 1;
  const showingTo = Math.min(currentPage * productsPerPage, totalProducts);

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());

    // remove page from the params
    if (params.get("page")) {
      params.delete("page");
    }

    // define the new params
    const newParams = params.size > 0 ? `&${params.toString()}` : "";

    // update the currentParams
    setCurrentParams(newParams);
  }, [searchParams]);

  return (
    <div className="flex items-center justify-between px-4 py-3 border-t border-neutral-200 mt-2">
      {/* Left side - metadata text */}
      <p className="text-sm text-neutral-500">
        Showing {showingFrom} to {showingTo} of {totalProducts} products
      </p>

      {/* Right side - navigation buttons */}
      <div className="flex items-center gap-1">
        <div className="px-3 py-1 rounded border border-neutral-200 text-sm text-neutral-700">
          {currentPage <= 1 ? (
            <span className="opacity-40 cursor-not-allowed ">Previous</span>
          ) : (
            <Link
              href={`/?page=${currentPage - 1}${currentParams}`}
              className=" hover:bg-neutral-50"
            >
              Previous
            </Link>
          )}
        </div>

        {getPageNumbers().map((page) => (
          <Link
            href={`/?page=${page}${currentParams}`}
            key={`page-${page}`}
            className={
              page === currentPage
                ? "px-3 py-1 rounded border text-sm font-medium bg-purple-600 text-white border-purple-600"
                : "px-3 py-1 rounded border border-neutral-200 text-sm text-neutral-700 hover:bg-neutral-50"
            }
          >
            {page}
          </Link>
        ))}

        <div className="px-3 py-1 rounded border border-neutral-200 text-sm text-neutral-700">
          {currentPage === totalPages ? (
            <span className="opacity-40 cursor-not-allowed ">Next</span>
          ) : (
            <Link
              href={`/?page=${currentPage + 1}${currentParams}`}
              className="hover:bg-neutral-50"
            >
              Next
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}


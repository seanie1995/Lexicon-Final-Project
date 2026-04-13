"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { ProductWithRelations } from "@/app/types/prisma";
import ProductCard from "@/components/product-card";
import { getProducts } from "@/lib/actions/products";

const HomeFeaturedBooks = () => {
	const scrollRef = useRef<HTMLDivElement>(null);
	const [books, setBooks] = useState<ProductWithRelations[]>([]);

	useEffect(() => {
		const fetchBooks = async () => {
			const { data } = await getProducts({
				conditionGrades: ["A+", "A"],
				pageSize: 20,
			});
			const shuffled = [...(data || [])]
				.sort(() => Math.random() - 0.5)
				.slice(0, 8);
			setBooks(shuffled);
		};
		fetchBooks();
	}, []);

	const scroll = (direction: "left" | "right") => {
		if (scrollRef.current) {
			const scrollAmount = 320;
			scrollRef.current.scrollBy({
				left: direction === "left" ? -scrollAmount : scrollAmount,
				behavior: "smooth",
			});
		}
	};

	return (
		<section className="overflow-hidden bg-surface-container-low py-24 group relative">
			<div className="mx-auto max-w-screen-2xl px-8 lg:px-12">
				<header className="mb-12 flex items-end justify-between">
					<div className="space-y-2">
						<p className="font-label text-xs uppercase tracking-[0.3em] text-secondary">
							The Collection
						</p>
						<h2 className="font-headline text-4xl font-bold text-on-surface">
							Featured Rarities
						</h2>
					</div>
					<Link
						href="/catalog"
						className="font-label text-xs uppercase tracking-widest text-primary border-b border-primary pb-1 transition-colors hover:text-primary-container"
					>
						View Full Catalog
					</Link>
				</header>

				<button
					type="button"
					onClick={() => scroll("left")}
					className="absolute left-4 top-1/2 -translate-y-1/2 z-10 hidden group-hover:flex items-center justify-center w-12 h-12 bg-surface text-primary shadow-lg"
					aria-label="Scroll left"
				>
					<ChevronLeft className="w-6 h-6" />
				</button>

				<button
					type="button"
					onClick={() => scroll("right")}
					className="absolute right-4 top-1/2 -translate-y-1/2 z-10 hidden group-hover:flex items-center justify-center w-12 h-12 bg-surface text-primary shadow-lg"
					aria-label="Scroll right"
				>
					<ChevronRight className="w-6 h-6" />
				</button>

				<div
					ref={scrollRef}
					className="flex gap-10 overflow-x-auto pb-10 -mx-8 px-8 lg:-mx-12 lg:px-12 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
				>
					{books.map((book) => (
						<article key={book.id} className="min-w-[300px]">
							<ProductCard product={book} />
						</article>
					))}
				</div>
			</div>
		</section>
	);
};

export default HomeFeaturedBooks;

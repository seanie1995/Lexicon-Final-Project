import Link from "next/link";
import ProductCard from "@/components/product-card";
import { getProducts } from "@/lib/actions/products";

const HomeFeaturedBooks = async () => {
	const { data: books } = await getProducts({
		conditionGrades: ["A+", "A"],
		pageSize: 20,
	});

	const shuffled = [...(books || [])]
		.sort(() => Math.random() - 0.5)
		.slice(0, 5);

	return (
		<section className="overflow-hidden bg-surface-container-low py-24">
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

				<div className="flex gap-10 overflow-x-auto pb-10 -mx-8 px-8 lg:-mx-12 lg:px-12">
					{shuffled.map((book) => (
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

import Link from "next/link";
import NewArrivalCard from "@/components/new-arrival-card";
import { getProducts } from "@/lib/actions/products";

const HomeNewArrivals = async () => {
	const { data: books } = await getProducts({
		sortBy: "id",
		sortOrder: "desc",
		pageSize: 2,
	});

	return (
		<section className="border-t border-outline-variant/10 bg-surface-container-low py-24">
			<div className="mx-auto max-w-screen-2xl px-8 lg:px-12">
				<header className="mb-16 space-y-4 text-center">
					<p className="font-label text-xs uppercase tracking-[0.4em] text-secondary">
						Just Cataloged
					</p>
					<h2 className="font-headline text-5xl font-bold text-on-surface">
						New Arrivals
					</h2>
				</header>

				<div className="space-y-20">
					{books.map((book, index) => (
						<NewArrivalCard
							key={book.id}
							product={book}
							reverse={index % 2 !== 0}
						/>
					))}
				</div>

				<nav className="mt-24 text-center">
					<Link
						href="/catalog"
						className="bg-secondary px-12 py-5 font-label text-xs uppercase tracking-widest text-on-secondary transition-colors hover:bg-on-secondary-fixed-variant inline-block"
					>
						View All New Additions
					</Link>
				</nav>
			</div>
		</section>
	);
};

export default HomeNewArrivals;

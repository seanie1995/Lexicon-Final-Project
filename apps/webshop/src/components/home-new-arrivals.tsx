import LinkButton from "@/components/link-button";
import NewArrivalCard from "@/components/new-arrival-card";
import { getProducts } from "@/lib/actions/products";

const HomeNewArrivals = async () => {
	const { data: books } = await getProducts({
		sortBy: "id",
		sortOrder: "desc",
		pageSize: 2,
	});

	return (
		<section
			className="border-t border-outline-variant/10 bg-surface-container-low py-24"
			aria-labelledby="new-arrivals-title"
		>
			<div className="mx-auto max-w-screen-2xl px-8 lg:px-12">
				<header className="mb-16 space-y-4 text-center">
					<p className="font-label text-xs uppercase tracking-[0.4em] text-secondary">
						Just Cataloged
					</p>
					<h2
						id="new-arrivals-title"
						className="font-headline text-5xl font-bold text-on-surface"
					>
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
					<LinkButton href="/catalog" variant="secondary">
						View All New Additions
					</LinkButton>
				</nav>
			</div>
		</section>
	);
};

export default HomeNewArrivals;

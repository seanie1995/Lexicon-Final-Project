import type { Metadata } from "next";
import { getBlogposts } from "@/lib/actions/blogs";
import { getProducts } from "@/lib/actions/products";

export const metadata: Metadata = {
	title: "Site Map | The Digital Archivist",
};

export default async function SitemapPage() {
	const products = await getProducts();
	const posts = await getBlogposts();

	const pages = [
		{ section: "Main", items: [{ url: "/", label: "Home" }] },
		{
			section: "Catalog",
			items: [
				{ url: "/catalog", label: "General Catalog" },
				...products.data.map((p) => ({
					url: `/product/${p.id}`,
					label: p.title,
				})),
			],
		},
		{
			section: "Journal",
			items: [
				{ url: "/journal", label: "Journal" },
				...posts.map((p) => ({ url: `/journal/${p.id}`, label: p.title })),
			],
		},
		{
			section: "Information",
			items: [
				{ url: "/contact", label: "Contact" },
				{ url: "/shipping", label: "Shipping & Returns" },
			],
		},
		{
			section: "Account",
			items: [
				{ url: "/login", label: "Sign In" },
				{ url: "/register", label: "Register" },
				{ url: "/checkout", label: "Checkout" },
			],
		},
	];

	return (
		<main className="min-h-screen bg-surface pt-24 pb-32">
			<section className="mx-auto max-w-screen-2xl px-8 lg:px-12">
				<div className="mb-16 max-w-2xl">
					<p className="mb-4 font-label text-[11px] font-semibold uppercase tracking-[0.28em] text-secondary">
						Directory
					</p>
					<h1 className="font-headline text-5xl italic leading-[0.95] text-primary md:text-6xl lg:text-7xl">
						Site Map
					</h1>
				</div>

				<div className="grid gap-16 md:grid-cols-2 lg:gap-20">
					{pages.map((section) => (
						<div key={section.section}>
							<h2 className="mb-8 font-headline text-2xl font-bold text-on-surface">
								{section.section}
							</h2>
							<ul className="space-y-3">
								{section.items.map((item) => (
									<li key={item.url}>
										<a
											href={item.url}
											className="group flex items-center gap-3 border-b border-outline-variant pb-3 transition-all hover:border-primary"
										>
											<span className="font-headline text-lg text-on-surface transition-colors group-hover:text-primary">
												{item.label}
											</span>
											<span className="font-label text-xs text-outline transition-all group-hover:text-primary">
												{item.url}
											</span>
										</a>
									</li>
								))}
							</ul>
						</div>
					))}
				</div>
			</section>

			<section className="mx-auto max-w-screen-2xl px-8 pt-24 lg:px-12">
				<div className="border-t border-outline-variant pt-8">
					<p className="font-label text-xs uppercase tracking-[0.18em] text-outline">
						Machine Readable{" "}
						<a
							href="/sitemap.xml"
							className="text-secondary transition-colors hover:text-primary"
						>
							/sitemap.xml
						</a>
					</p>
				</div>
			</section>
		</main>
	);
}

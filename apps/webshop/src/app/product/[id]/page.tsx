import { getProductById } from "@/lib/actions/products";
import { notFound } from "next/navigation";
import { ArrowLeft, Verified, Globe, FileText } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface PageProps {
	params: Promise<{ id: string }>;
}

export default async function ProductPage({ params }: PageProps) {
	const { id } = await params;
	const product = await getProductById(Number(id));

	// 404 if no product is found
	if (!product) {
		notFound();
	}

	// I hate that we have the images as an array/jsonvalue in the db, but well, this works
	const images = Array.isArray(product.images)
		? (product.images as string[])
		: [];
	const mainImage = images[0] || product.thumbnail;

	return (
		<main className="max-w-screen-2xl mx-auto px-8 pt-32 pb-24 font-body">
			{/* Breadcrumb & Navigation Back */}
			<div className="mb-12">
				<Link
					href="/"
					className="inline-flex items-center text-secondary font-label text-sm hover:text-primary transition-colors"
				>
					<ArrowLeft className="w-4 h-4 mr-2" />
					Return to Catalog
				</Link>
			</div>

			{/* Product Hero Section */}
			<div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-32">
				<div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-6">
					<div className="relative md:col-span-2 aspect-4/5 bg-surface-container-low overflow-hidden">
						<Image
							src={mainImage}
							alt={product.title}
							className="w-full h-full object-cover"
							fill
							priority
							sizes="(max-width: 1024px) 100vw, 60vw"
						/>
					</div>
				</div>

				{/* Product Info: Editorial Layout */}
				<div className="lg:col-span-5 flex flex-col justify-center">
					<div className="space-y-8">
						<div>
							<p className="font-label text-sm uppercase tracking-[0.2em] text-secondary mb-4">
								Ref. No: DA-{product.year.getFullYear()}-{product.id}
							</p>
							<h1 className="font-headline text-5xl md:text-6xl text-on-surface leading-tight mb-4">
								{product.title}
							</h1>
							<p className="font-headline italic text-2xl text-secondary">
								By {product.author.name}
							</p>
						</div>

						<div className="h-px w-24 bg-outline-variant/30" />

						<div className="space-y-6">
							<p className="font-body text-lg text-on-surface-variant leading-relaxed">
								{product.description}
							</p>

							<div className="bg-surface-container-low p-8 space-y-4">
								<div className="flex justify-between items-baseline">
									<span className="font-label text-sm text-secondary">
										Market Value
									</span>
									<span className="font-headline text-3xl text-primary">
										{product.price.toLocaleString()} SEK
									</span>
								</div>
								<p className="font-label text-xs text-on-surface-variant italic">
									Inclusive of certified archival assessment and provenance
									ledger.
								</p>
							</div>
						</div>

						<div className="pt-6 space-y-4">
							<button
								type="button"
								className="w-full py-5 bg-primary text-on-primary font-label font-bold tracking-widest hover:bg-primary-container transition-all duration-300 cursor-pointer"
							>
								ADD TO CART
							</button>
						</div>

					</div>
				</div>
			</div>

			{/* Detailed Content Grid */}
			<div className="grid grid-cols-1 lg:grid-cols-12 gap-16 border-t border-outline-variant/15 pt-24">
				{/* Left Column: Specs & Condition */}
				<div className="lg:col-span-4 space-y-16">
					{/* Specifications */}
					<section>
						<h2 className="font-headline text-2xl mb-8">Specifications</h2>
						<ul className="space-y-6">
							<SpecItem label="Publisher" value={product.publisher.name} />
							<SpecItem
								label="Year"
								value={product.year.getFullYear().toString()}
							/>
							<SpecItem label="Format" value={product.format} />
							<SpecItem label="Genre" value={product.genre} />
							<SpecItem label="Binding" value={product.binding} />
						</ul>
					</section>

					{/* Margin Note Component */}
					<aside className="p-8 border-l-2 border-primary bg-surface-container-lowest">
						<p className="font-body italic text-on-surface-variant leading-relaxed">
							"The Digital Archivist's seal on this volume confirms that the
							binding remains untouched since its last documented
							restoration."
						</p>
					</aside>
				</div>

				{/* Right Column: Narrative Sections */}
				<div className="lg:col-span-8 space-y-24">
					{/* Condition Report */}
					<section>
						<div className="flex items-center gap-x-4 mb-8">
							<h2 className="font-headline text-3xl">Condition Report</h2>
							<span className="px-3 py-1 bg-surface-container-highest text-secondary font-label text-[10px] uppercase tracking-widest">
								Grade: {product.condition.grade}
							</span>
						</div>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-12">
							<div className="space-y-4">
								<h3 className="font-label text-sm font-bold text-on-surface uppercase tracking-widest">
									Exterior
								</h3>
								<p className="font-body text-on-surface-variant leading-relaxed">
									{product.condition.exterior}
								</p>
							</div>
							<div className="space-y-4">
								<h3 className="font-label text-sm font-bold text-on-surface uppercase tracking-widest">
									Interior
								</h3>
								<p className="font-body text-on-surface-variant leading-relaxed">
									{product.condition.interior}
								</p>
							</div>
						</div>
					</section>

					{/* History & Provenance */}
					<section className="bg-surface-container-low p-12 relative overflow-hidden">
						<div className="relative z-10">
							<h2 className="font-headline text-3xl mb-8">
								History & Provenance
							</h2>
							<div className="max-w-2xl space-y-6">
								<p className="font-body text-on-surface-variant leading-relaxed">
									{product.author.description}
								</p>
								<div className="pt-4">
									<button
										type="button"
										className="inline-flex items-center text-primary font-label text-sm font-bold uppercase tracking-widest hover:opacity-70 transition-opacity"
									>
										Download Provenance Ledger (PDF)
										<FileText className="w-4 h-4 ml-2" />
									</button>
								</div>
							</div>
						</div>
					</section>
				</div>
			</div>
		</main>
	);
}

function SpecItem({ label, value }: { label: string; value: string }) {
	return (
		<li className="flex justify-between items-end border-b border-outline-variant/10 pb-2">
			<span className="font-label text-xs uppercase tracking-widest text-secondary">
				{label}
			</span>
			<span className="font-body text-on-surface">{value}</span>
		</li>
	);
}

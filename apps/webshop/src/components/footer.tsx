import Link from "next/link";

const Footer = () => {
	return (
		<footer className="w-full rounded-none border-t border-outline-variant/15 bg-surface-container-low">
			<div className="grid grid-cols-1 md:grid-cols-3 gap-12 px-8 py-16 w-full max-w-screen-2xl mx-auto lg:px-12">
				<section className="space-y-6">
					<h3 className="text-xl font-serif text-primary">
						The Digital Archivist
					</h3>
					<p className="font-body leading-relaxed text-secondary max-w-sm">
						Preserving the tactile heritage of rare literature for the modern
						scholar. Every volume in our archive is hand-authenticated and
						cataloged with historical precision.
					</p>
					<small className="text-xs font-label text-primary/60">
						&copy; 2026 The Digital Archivist. All rights reserved.
					</small>
				</section>

				<section className="grid grid-cols-2 gap-8">
					<nav aria-label="Footer navigation">
						<h4 className="font-label text-xs uppercase tracking-[0.2em] text-primary mb-6">
							Navigation
						</h4>

						<ul className="space-y-4 font-body leading-relaxed">
							<li>
								<Link
									className="text-secondary hover:text-primary underline decoration-transparent hover:decoration-primary transition-all"
									href="/"
								>
									Catalog
								</Link>
							</li>
							<li>
								<Link
									className="text-secondary hover:text-primary underline decoration-transparent hover:decoration-primary transition-all"
									href="/shipping"
								>
									Shipping &amp; Handling
								</Link>
							</li>
							<li>
								<Link
									className="text-secondary hover:text-primary underline decoration-transparent hover:decoration-primary transition-all"
									href="/contact"
								>
									Contact
								</Link>
							</li>
							<li>
								<Link
									className="text-secondary hover:text-primary underline decoration-transparent hover:decoration-primary transition-all"
									href="/sitemap"
								>
									Sitemap
								</Link>
							</li>
						</ul>
					</nav>

					<nav aria-label="Social media links">
						<h4 className="font-label text-xs uppercase tracking-[0.2em] text-primary mb-6">
							Social
						</h4>
						<ul className="space-y-4 font-body leading-relaxed">
							<li>
								<a
									className="text-secondary hover:text-primary transition-all"
									href="https://instagram.com"
									target="_blank"
									rel="noopener noreferrer"
								>
									Instagram
								</a>
							</li>
							<li>
								<a
									className="text-secondary hover:text-primary transition-all"
									href="https://x.com"
									target="_blank"
									rel="noopener noreferrer"
								>
									X
								</a>
							</li>
						</ul>
					</nav>
				</section>

				<section className="bg-surface-container p-8">
					<h4 className="font-headline text-lg italic text-primary mb-4">
						Join the Inner Circle
					</h4>
					<p className="font-body text-sm text-secondary mb-6 leading-relaxed">
						Receive occasional updates on newly acquired rarities and private
						auctions.
					</p>
					<form className="flex">
						<label htmlFor="email" className="sr-only">
							Email address
						</label>
						<input
							id="email"
							name="email"
							type="email"
							className="flex-1 bg-surface border-none focus:ring-0 text-sm font-label italic px-4 py-3"
							placeholder="Your parchment address..."
							required
						/>
						<button
							type="submit"
							className="bg-primary text-on-primary px-6 font-label text-xs uppercase tracking-widest"
						>
							Subscribe
						</button>
					</form>
				</section>
			</div>
		</footer>
	);
};

export default Footer;

import Image from "next/image";
import Link from "next/link";
import LinkButton from "@/components/link-button";

const HomeHero = () => {
	return (
		<section
			className="relative overflow-hidden bg-surface py-24"
			aria-labelledby="hero-title"
		>
			<div className="flex flex-col gap-16 lg:flex-row lg:items-center">
				{/* ── Text block ── */}
				<div className="z-10 max-w-2xl flex-1 space-y-8">
					<header className="space-y-4">
						<p className="font-label text-label-sm uppercase tracking-[0.3em] text-secondary">
							First Edition Highlight
						</p>

						<h1
							id="hero-title"
							className="font-headline text-5xl font-black leading-[1.1] tracking-tight text-on-surface lg:text-7xl"
						>
							Preserving the{" "}
							<span className="font-serif italic font-normal">Soul</span> of the
							Written Word
						</h1>

						<p className="max-w-lg text-lg leading-relaxed text-on-surface-variant lg:text-xl">
							Step into a curated digital vault where rare first editions and
							centuries-old manuscripts find a second life. Each volume is a
							piece of history, waiting to be rediscovered.
						</p>
					</header>

					<nav className="flex flex-wrap gap-6 pt-4" aria-label="Hero actions">
						<LinkButton href="/catalog">
							Explore the Archive
						</LinkButton>
					</nav>
				</div>

				{/* ── Image block ── */}
				<figure className="relative flex-1">
					<div className="relative mx-auto aspect-4/5 w-full max-w-md border border-outline-variant/10 bg-surface-container-low p-8 shadow-2xl lg:ml-auto lg:mr-0">
						<Image
							src="https://lh3.googleusercontent.com/aida-public/AB6AXuCM2SQIHyfsXzhrP3ZdGGqGlbS7B7Enz1yTvXBu9qdAMj-1m8CpxF4M7belMmHY5CXgQJrU702_BPpS--yFElKPQ7tvPFyKiRNhJCuriQvSxbL353bam2j6Ewf0SQkqOqPMFltupKL3-1trvu0gVH6jk0jVgfkY17XqWX2buo4xrkEwKZzMxL9IQTcq4jaDG-1S_HM_7rl9nWbswVJLRXqpnQ4MqQsorHKBhEWKwYkCarAO4YLg54PV2oZkvc5bM9mmTaCw-TF25dYh"
							alt="Close-up of an aged leather-bound book with intricate gold leaf stamping on the cover"
							fill
							className="object-cover grayscale-20 sepia-10"
							sizes="(max-width: 768px) 100vw, 448px"
						/>

						{/* Marginal note overlay */}
						<blockquote className="absolute -bottom-10 left-4 max-w-xs bg-surface-container-lowest p-6 shadow-xl sm:-left-12">
							<div className="border-l-2 border-primary pl-4">
								<p className="font-body text-sm italic leading-relaxed text-on-surface">
									&ldquo;A truly great book should be read in youth, again in
									maturity and once more in old age.&rdquo;
								</p>
								<footer className="mt-3 font-label text-[10px] uppercase tracking-widest text-secondary">
									— Robertson Davies
								</footer>
							</div>
						</blockquote>
					</div>
				</figure>
			</div>
		</section>
	);
};

export default HomeHero;

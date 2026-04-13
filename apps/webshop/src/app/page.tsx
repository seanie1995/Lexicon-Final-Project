import type { Metadata } from "next";
import HomeHero from "@/components/home-hero";
import HomeFeaturedBooks from "@/components/home-featured-books";
import HomeEditorialSections from "@/components/home-editorial-sections";
import HomeNewArrivals from "@/components/home-new-arrivals";


export const metadata: Metadata = {
	title: "The Digital Archivist — Rare Books & Manuscripts",
	description:
		"Discover rare first editions, illuminated manuscripts and leather-bound treasures. Each volume a piece of history, waiting to be rediscovered.",
};


export default function Home() {
	return (
		<main className="pt-24">
			<HomeHero />
			<HomeFeaturedBooks />
			<HomeEditorialSections />
			<HomeNewArrivals />
		</main>
	);
}

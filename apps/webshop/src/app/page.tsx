import HomeHero from "@/components/home-hero";
import HomeFeaturedBooks from "@/components/home-featured-books";
import HomeEditorialSections from "@/components/home-editorial-sections";
import HomeNewArrivals from "@/components/home-new-arrivals";

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

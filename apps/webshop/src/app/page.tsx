import HomeHero from "@/components/home-hero";
import HomeFeaturedBooks from "@/components/home-featured-books";

export default function Home() {
	return (
		<main className="pt-24">
			<HomeHero />
			<HomeFeaturedBooks />
		</main>
	);
}

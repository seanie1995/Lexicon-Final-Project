import JournalHero from "@/components/journal-hero";
import JournalLatestPost from "@/components/journal-latest-post";

export default function Journal() {
	return (
		<main className="pt-24">
			<div className="mx-auto max-w-7xl px-6 lg:px-20">
				<JournalHero />
				<JournalLatestPost />
			</div>
		</main>
	);
}
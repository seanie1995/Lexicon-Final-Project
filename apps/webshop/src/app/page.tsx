import type { Metadata } from "next";
import HomeEditorialSections from "@/components/home-editorial-sections";
import HomeFeaturedBooks from "@/components/home-featured-books";
import HomeHero from "@/components/home-hero";
import HomeNewArrivals from "@/components/home-new-arrivals";

export const metadata: Metadata = {
  title: "The Digital Archivist — Rare Books & Manuscripts",
  description:
    "Discover rare first editions, illuminated manuscripts and leather-bound treasures. Each volume a piece of history, waiting to be rediscovered.",
};

export default function Home() {
  return (
    <main className="pt-24">
      <div className="mx-auto max-w-screen-2xl px-8 lg:px-12">
        <HomeHero />
        <HomeEditorialSections />
      </div>
      <HomeFeaturedBooks />
      <HomeNewArrivals />
    </main>
  );
}

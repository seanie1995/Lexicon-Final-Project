import type { Metadata } from "next";
import JournalHero from "@/components/journal-hero";
import JournalLatestPost from "@/components/journal-latest-post";
import BlogPostGrid from "@/components/blogpost-grid";
import { getBlogposts } from "@/lib/actions/blogs";

export const metadata: Metadata = {
  title: "The Journal | The Digital Archivist",
  description:
    "Scholarly essays, archival discoveries and literary history from the curators of The Digital Archivist.",
};

export default async function Journal() {
  const posts = await getBlogposts();

  return (
    <main className="min-h-screen pt-24">
      <div className="mx-auto max-w-7xl px-6 py-16 md:px-12 md:py-24">
        <JournalHero />
        <JournalLatestPost />

        <section className="mt-24">
          <h2 className="font-headline mb-12 text-3xl text-on-surface">
            More From the Archive
          </h2>
          <BlogPostGrid posts={posts} />
        </section>
      </div>
    </main>
  );
}

"use client";

import Image from "next/image";
import { Blogpost } from "@/app/types/types";
import { formatDate } from "@/lib/formatters";

interface BlogPostContentProps {
  post: Blogpost;
}

const BlogPostContent = ({ post }: BlogPostContentProps) => {
  return (
    <main className="min-h-screen bg-background pt-24">
      {/* Hero Section */}
      <section className="relative w-full h-[45vh] md:h-150 overflow-hidden">
        <Image
          src={post.image}
          alt={post.title}
          fill
          className="object-cover grayscale-20 hover:grayscale-0 transition-all duration-1000"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-linear-to-t from-background via-transparent to-transparent"></div>
      </section>

      {/* Article Header */}
      <header className="max-w-4xl mx-auto px-6 -mt-100 relative z-10 text-center">
        <div className="bg-surface p-8 md:p-12 shadow-sm border border-outline-variant/10">
          <nav className="mb-8 flex justify-center items-center gap-4 text-xs font-label tracking-[0.2em] text-secondary uppercase">
            <span className="cursor-pointer hover:text-primary transition-colors">
              The Archivist's Journal
            </span>
            <span className="w-1 h-1 bg-outline-variant rounded-full"></span>
            <span>Volume IV</span>
          </nav>
          <h1 className="text-4xl md:text-7xl font-headline font-extrabold text-primary mb-8 leading-tight tracking-tight italic">
            {post.title}
          </h1>
          <div className="flex flex-col items-center gap-2">
            <p className="text-lg font-headline italic text-on-surface">
              By {post.author}, {post.authorTitle}
            </p>
            <p className="text-xs font-label uppercase tracking-widest text-secondary mt-2">
              {formatDate(post.createdAt)}
            </p>
          </div>
        </div>
      </header>

      {/* Body Text */}
      <article className="max-w-3xl mx-auto px-6 py-20 pb-40">
        <div
          className="space-y-10 text-lg md:text-xl leading-relaxed text-on-surface-variant font-body first-letter:text-7xl first-letter:font-headline first-letter:float-left first-letter:mr-3 first-letter:text-primary"
          dangerouslySetInnerHTML={{
            __html: post.body
              .split("\n")
              .filter((p) => p.trim())
              .map((p) => `<p>${p.trim()}</p>`)
              .join(""),
          }}
        />
      </article>
    </main>
  );
};

export default BlogPostContent;

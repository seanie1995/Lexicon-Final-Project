import Image from "next/image";
import Link from "next/link";
import { getLatestBlogpost } from "@/lib/actions/blogs";
import { formatDate } from "@/lib/formatters";
import LinkButton from "@/components/link-button";

const JournalLatestPost = async () => {
  const post = await getLatestBlogpost();

  if (!post) return null;

  return (
    <section className="editorial-grid mb-32 grid grid-cols-12 gap-6 md:gap-12">
      <div className="col-span-12 lg:col-span-7">
        <Link
          href={`/journal/${post.id}`}
          aria-hidden="true"
          tabIndex={-1}
          className="group relative block aspect-4/3 overflow-hidden bg-surface-container-low"
        >
          <Image
            src={post.image}
            alt=""
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 60vw"
            priority
          />
        </Link>
      </div>
      <div className="col-span-12 flex flex-col justify-center lg:col-span-5">
        <span className="font-label mb-3 text-[10px] uppercase tracking-widest text-secondary">
          <time dateTime={post.createdAt.toISOString()}>
            {formatDate(post.createdAt)}
          </time>{" "}
        </span>
        <Link href={`/journal/${post.id}`}>
          <h2 className="font-headline mb-6 cursor-pointer text-xl leading-tight text-on-surface transition-colors duration-300 hover:text-primary md:text-4xl wrap-break-word">
            {post.title}
          </h2>
        </Link>

        <p className="font-body mb-8 leading-relaxed text-on-surface-variant">
          {post.body.length > 200 ? `${post.body.slice(0, 197)}...` : post.body}
        </p>
        <LinkButton
          href={`/journal/${post.id}`}
          ariaLabel={`Read full article: ${post.title}`}
        >
          Read the Full Treatise
        </LinkButton>
      </div>
    </section>
  );
};

export default JournalLatestPost;

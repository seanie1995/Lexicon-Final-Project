import Image from "next/image";
import Link from "next/link";
import { Blogpost } from "@/app/types/types";
import { formatDate } from "@/lib/formatters";

interface BlogPostCardProps {
	post: Blogpost;
}

const BlogPostCard = ({ post }: BlogPostCardProps) => {
	return (
		<article className="flex flex-col">
			<Link
				href={`/journal/${post.id}`}
				className="group relative mb-8 aspect-square cursor-pointer overflow-hidden bg-surface-container-low"
			>
				<Image
					src={post.image}
					alt={post.title}
					fill
					className="object-cover"
					sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
				/>
			</Link>

			<time
				dateTime={new Date(post.createdAt).toISOString()}
				className="font-label mb-3 text-[10px] uppercase tracking-widest text-secondary"
			>
				{formatDate(post.createdAt)}
			</time>

			<h3 className="font-headline mb-4 text-2xl leading-tight text-on-surface">
				<Link
					href={`/journal/${post.id}`}
					className="hover:text-primary transition-colors"
				>
					{post.title}
				</Link>
			</h3>

			<p className="font-body mb-6 text-sm leading-relaxed text-on-surface-variant">
				{post.body.length > 160 ? `${post.body.slice(0, 157)}...` : post.body}
			</p>

			<Link
				href={`/journal/${post.id}`}
				className="font-label border-outline-variant w-fit border-b pb-1 text-[10px] uppercase tracking-widest text-secondary transition-all hover:border-primary hover:text-primary"
			>
				Continue Reading
			</Link>
		</article>
	);
};

export default BlogPostCard;

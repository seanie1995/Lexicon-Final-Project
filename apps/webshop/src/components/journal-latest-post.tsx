import Image from "next/image";
import Link from "next/link";
import { getLatestBlogpost } from "@/lib/actions/blogs";
import { formatDate } from "@/lib/formatters";

const JournalLatestPost = async () => {
	const post = await getLatestBlogpost();

	if (!post) return null;

	return (
		<section className="editorial-grid mb-32 grid grid-cols-12 gap-12">
			<div className="col-span-12 lg:col-span-7">
				<Link
					href={`/journal/${post.id}`}
					className="group relative block aspect-4/3 overflow-hidden bg-surface-container-low"
				>
					<Image
						src={post.image}
						alt={post.title}
						fill
						className="object-cover transition-transform duration-700 group-hover:scale-105"
						sizes="(max-width: 1024px) 100vw, 60vw"
						priority
					/>
				</Link>
			</div>
			<div className="col-span-12 flex flex-col justify-center lg:col-span-5">
				<span className="font-label mb-3 text-[10px] uppercase tracking-widest text-secondary">
					{formatDate(post.createdAt)}
				</span>
				<Link href={`/journal/${post.id}`}>
					<h2 className="font-headline mb-6 cursor-pointer text-4xl leading-tight text-on-surface transition-colors duration-300 hover:text-primary">
						{post.title}
					</h2>
				</Link>

				<p className="font-body mb-8 leading-relaxed text-on-surface-variant">
					{post.body.length > 200 ? `${post.body.slice(0, 197)}...` : post.body}
				</p>
				<Link
					href={`/journal/${post.id}`}
					className="bg-primary hover:bg-primary-container inline-block w-fit px-8 py-4 font-label text-xs uppercase tracking-widest text-on-primary transition-colors"
				>
					Read the Full Treatise
				</Link>
			</div>
		</section>
	);
};

export default JournalLatestPost;

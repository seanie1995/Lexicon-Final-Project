import { Blogpost } from "@/app/types/types";
import BlogPostCard from "./blogpost-card";

interface BlogPostGridProps {
	posts: Blogpost[];
}

const BlogPostGrid = ({ posts }: BlogPostGridProps) => {
	return (
		<div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-3">
			{posts.map((post) => (
				<BlogPostCard key={post.id} post={post} />
			))}
		</div>
	);
};

export default BlogPostGrid;

import { notFound } from "next/navigation";
import { getBlogpostById } from "@/lib/actions/blogs";
import BlogPostContent from "@/components/blog-post-content";

interface BlogpostPageProps {
  params: Promise<{ id: string }>;
}

export default async function BlogPostPage({ params }: BlogpostPageProps) {
  const { id } = await params;
  const postId = parseInt(id);

  if (isNaN(postId)) {
    notFound();
  }

  const post = await getBlogpostById(postId);

  if (!post) {
    notFound();
  }

  return <BlogPostContent post={post} />;
}

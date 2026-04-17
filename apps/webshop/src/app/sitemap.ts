import type { MetadataRoute } from "next";
import { getBlogposts } from "@/lib/actions/blogs";
import { getProducts } from "@/lib/actions/products";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const products = await getProducts();
	const posts = await getBlogposts();

	const productUrls = products.data.map((product) => ({
		url: `/product/${product.id}`,
		lastModified: new Date(),
		changeFrequency: "weekly" as const,
		priority: 0.8,
	}));

	const blogPostUrls = posts.map((post) => ({
		url: `/journal/${post.id}`,
		lastModified: new Date(),
		changeFrequency: "weekly" as const,
		priority: 0.8,
	}));

	return [
		{
			url: "/",
			lastModified: new Date(),
			changeFrequency: "weekly" as const,
			priority: 1,
		},
		{
			url: "/catalog",
			lastModified: new Date(),
			changeFrequency: "weekly" as const,
			priority: 0.9,
		},
		{
			url: "/login",
			lastModified: new Date(),
			changeFrequency: "monthly" as const,
			priority: 0.5,
		},
		{
			url: "/register",
			lastModified: new Date(),
			changeFrequency: "monthly" as const,
			priority: 0.5,
		},
		{
			url: "/checkout",
			lastModified: new Date(),
			changeFrequency: "weekly" as const,
			priority: 0.6,
		},
		{
			url: "/contact",
			lastModified: new Date(),
			changeFrequency: "monthly" as const,
			priority: 0.5,
		},
		{
			url: "/shipping",
			lastModified: new Date(),
			changeFrequency: "monthly" as const,
			priority: 0.5,
		},
		{
			url: "/journal",
			lastModified: new Date(),
			changeFrequency: "weekly" as const,
			priority: 0.8,
		},
		...productUrls,
		...blogPostUrls,
	];
}

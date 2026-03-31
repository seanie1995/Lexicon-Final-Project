import type { MetadataRoute } from "next";
import { getProducts } from "@/lib/actions/products";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const products = await getProducts();

	const productUrls = products.data.map((product) => ({
		url: `/product/${product.id}`,
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
		...productUrls,
	];
}

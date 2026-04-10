"use server";

import { prisma } from "@/lib/prisma";
import type { Blogpost } from "@/app/types/types";

export async function getLatestBlogpost(): Promise<Blogpost | null> {
	try {
		const latestPost = await prisma.blogpost.findFirst({
			orderBy: {
				createdAt: "desc",
			},
		});
		return latestPost as Blogpost | null;
	} catch (error) {
		console.error("Error fetching latest blogpost:", error);
		return null;
	}
}

export async function getBlogposts(): Promise<Blogpost[]> {
	try {
		const posts = await prisma.blogpost.findMany({
			orderBy: {
				createdAt: "desc",
			},
		});
		return posts as Blogpost[];
	} catch (error) {
		console.error("Error fetching blogposts:", error);
		return [];
	}
}

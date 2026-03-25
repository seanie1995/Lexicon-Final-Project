"use server";

import type {
	PaginatedResult,
	ProductFilters,
	ProductWithRelations,
} from "@/app/types/prisma";
import { prisma } from "@/lib/prisma";

const productInclude = {
	category: true,
	condition: true,
	author: true,
	publisher: true,
} as const;

export async function getProducts(
	filters: ProductFilters = {},
): Promise<PaginatedResult<ProductWithRelations>> {
	const {
		page = 1,
		pageSize = 12,
		categoryId,
		search,
		sortBy = "title",
		sortOrder = "asc",
	} = filters;

	const where: Record<string, unknown> = {};

	if (categoryId) {
		where.categoryId = categoryId;
	}

	if (search) {
		where.OR = [
			{ title: { contains: search, mode: "insensitive" } },
			{ description: { contains: search, mode: "insensitive" } },
			{ genre: { contains: search, mode: "insensitive" } },
		];
	}

	const [data, total] = await Promise.all([
		prisma.product.findMany({
			where,
			include: productInclude,
			orderBy: { [sortBy]: sortOrder },
			skip: (page - 1) * pageSize,
			take: pageSize,
		}),
		prisma.product.count({ where }),
	]);

	return {
		data,
		total,
		page,
		pageSize,
		totalPages: Math.ceil(total / pageSize),
	};
}

export async function getProductById(
	id: number,
): Promise<ProductWithRelations | null> {
	return prisma.product.findUnique({
		where: { id },
		include: productInclude,
	});
}

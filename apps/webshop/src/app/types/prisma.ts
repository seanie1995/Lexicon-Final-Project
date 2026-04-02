import type { Prisma } from "@prisma/client";

export type { OrderStatus } from "@prisma/client";
export interface PaginationParams {
	page?: number;
	pageSize?: number;
}

export interface ProductFilters extends PaginationParams {
	categoryId?: number;
	search?: string;
	genres?: string[];
	era?: string;
	conditionGrades?: string[];
	sortBy?: "title" | "price" | "year" | "author" | "id";
	sortOrder?: "asc" | "desc";
}

export interface PaginatedResult<T> {
	data: T[];
	total: number;
	page: number;
	pageSize: number;
	totalPages: number;
}

export type ProductWithRelations = Prisma.ProductGetPayload<{
	include: {
		category: true;
		condition: true;
		author: true;
		publisher: true;
	};
}>;

export type OrderWithRelations = Prisma.OrderGetPayload<{
	include: {
		items: true;
	};
}>;

export type OrderItemWithRelations = Prisma.OrderItemGetPayload<{
	include: {
		product: true;
	};
}>;

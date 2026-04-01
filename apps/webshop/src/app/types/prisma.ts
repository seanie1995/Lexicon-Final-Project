import type { Prisma } from "@prisma/client";

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
	sortBy?: "title" | "price" | "year" | "author";
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

export type OrderWithRelations = {
  id: number;
  userId: string;
  status: OrderStatus;
  totalAmount: number;
  createdAt: Date;
  items: OrderItemWithRelations[];
};

export type OrderItemWithRelations = {
  id: number;
  orderId: number;
  productId: number;
  product: ProductWithRelations;
  quantity: number;
  price: number;
};

export type OrderStatus = "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
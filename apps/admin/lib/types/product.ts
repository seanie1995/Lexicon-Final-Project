import type { Prisma } from "@prisma/client";

export type ProductWithRelations = Prisma.ProductGetPayload<{
  include: {
    category: true;
    condition: true;
    author: true;
    publisher: true;
  };
}>;

export type Category = { id: number; name: string };
export type Condition = {
  id: number;
  exterior: string;
  interior: string;
  grade: string;
};
export type Author = { id: number; name: string; description: string };
export type Publisher = { id: number; name: string; description: string };

export interface PaginatedProducts {
  data: ProductWithRelations[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export type OrderStatus = "PENDING" | "PAID" | "SHIPPED" | "DELIVERED" | "CANCELLED";

export type OrderWithItems = Prisma.OrderGetPayload<{
  include: { items: true };
}>;

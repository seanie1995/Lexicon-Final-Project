"use server";

import { prisma } from "@repo/db";
import { revalidatePath } from "next/cache";
import type { OrderStatus } from "@/lib/types/product";

const VALID_STATUSES = ["PENDING", "PAID", "SHIPPED", "DELIVERED", "CANCELLED"] as const;

export async function getOrders(page = 1, pageSize = 10, status?: string) {
  const where: Record<string, unknown> = {};

  if (status) {
    where.status = status;
  }

  const [data, total] = await Promise.all([
    prisma.order.findMany({
      where,
      include: { items: true },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.order.count({ where }),
  ]);

  return {
    data,
    total,
    page,
    pageSize,
    totalPages: total > 0 ? Math.ceil(total / pageSize) : 1,
  };
}

export async function getOrderById(id: string) {
  return prisma.order.findUnique({
    where: { id },
    include: { items: { include: { product: true } } },
  });
}

export async function updateOrderStatus(id: string, status: OrderStatus) {
  if (!VALID_STATUSES.includes(status)) {
    throw new Error(`Invalid order status: ${status}`);
  }

  const updateData: Record<string, unknown> = { status };

  if (status === "SHIPPED") updateData.shippedAt = new Date();
  if (status === "DELIVERED") updateData.deliveredAt = new Date();

  try {
    await prisma.order.update({
      where: { id },
      data: updateData,
    });
  } catch (error) {
    console.error("Failed to update order status:", error);
    throw new Error("Failed to update order status. The order may not exist.");
  }

  revalidatePath(`/orders/${id}`);
  revalidatePath("/orders");
}

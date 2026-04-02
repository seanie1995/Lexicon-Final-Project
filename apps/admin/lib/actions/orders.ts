"use server";

import { prisma } from "@repo/db";
import { revalidatePath } from "next/cache";
import type { OrderStatus } from "@/lib/types/product";

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
    totalPages: Math.ceil(total / pageSize),
  };
}

export async function getOrderById(id: string) {
  return prisma.order.findUnique({
    where: { id },
    include: { items: { include: { product: true } } },
  });
}

export async function updateOrderStatus(id: string, status: OrderStatus) {
  const updateData: Record<string, unknown> = { status };

  if (status === "SHIPPED") updateData.shippedAt = new Date();
  if (status === "DELIVERED") updateData.deliveredAt = new Date();

  await prisma.order.update({
    where: { id },
    data: updateData,
  });

  revalidatePath(`/orders/${id}`);
  revalidatePath("/orders");
}

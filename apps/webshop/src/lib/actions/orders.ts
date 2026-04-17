"use server";
 
import { prisma } from "@repo/db";
import type { OrderWithRelations } from "@/app/types/prisma";
 
export async function getOrdersForUser(
  userId: string
): Promise<OrderWithRelations[]> {
  const data = await prisma.order.findMany({
    where: { userId },
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });
 
  return data;
}
 
export async function getOrderByIdForUser(userId: string, orderId: string) {
  return prisma.order.findFirst({
    where: { id: orderId, userId },
    include: { items: { include: { product: true } } },
  });
}
 
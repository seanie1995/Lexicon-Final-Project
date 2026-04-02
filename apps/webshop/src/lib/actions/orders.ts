"use server";

import { prisma } from "@repo/db";
import type { OrderWithRelations } from "@/app/types/prisma";


export async function getOrdersforUser(
    userId: string
): Promise<OrderWithRelations[]> {
    const where: Record<string, unknown> = { userId };

    const [data, total] = await Promise.all([
        prisma.order.findMany({
            where,
            include: { items: { include: { product: true } } },
            orderBy: { createdAt: "desc" },
        }),
        prisma.order.count({ where }),
    ]);

    return {
        data,
        total
    };
}   

export async function getOrderByIdForUser(userId: string, orderId: string) {
    return prisma.order.findFirst({
        where: { id: orderId, userId },
        include: { items: { include: { product: true } } },
    });
}


"use server";

import { OrderStatus } from "@prisma/client";
import type Stripe from "stripe";
import { prisma } from "@/lib/prisma";

export async function createOrderFromStripeSession(
	session: Stripe.Checkout.Session,
): Promise<string | null> {
	// Check if order already exists for this session
	const existingOrder = await prisma.order.findUnique({
		where: { stripeSessionId: session.id },
	});

	if (existingOrder) {
		return existingOrder.id;
	}

	const shipping = session.collected_information?.shipping_details;
	const customerEmail = session.customer_details?.email;
	const customerName = session.customer_details?.name;

	if (!shipping || !customerEmail) {
		throw new Error("Missing shipping or customer email");
	}

	// Calculate total amount from line items (amount_total is in smallest currency unit)
	const totalAmount = session.amount_total ?? 0;
	const currency = session.currency ?? "sek";

	// Create order with items
	const order = await prisma.order.create({
		data: {
			stripeSessionId: session.id,
			customerEmail,
			customerName: customerName ?? undefined,
			totalAmount: Math.round(totalAmount / 100), // Convert from cents to whole units
			currency,
			status: OrderStatus.PAID, // Assuming payment is already completed
			paidAt: new Date(),

			shippingName: shipping.name ?? "",
			shippingLine1: shipping.address?.line1 ?? "",
			shippingLine2: shipping.address?.line2 ?? undefined,
			shippingCity: shipping.address?.city ?? "",
			shippingState: shipping.address?.state ?? undefined,
			shippingPostal: shipping.address?.postal_code ?? "",
			shippingCountry: shipping.address?.country ?? "",

			// Items will be created via relation
			items: {
				create:
					session.line_items?.data.map((item) => {
						const productIdStr = item.metadata?.productId;
						let productId: number | null = null;
						if (productIdStr) {
							const parsed = parseInt(productIdStr, 10);
							if (!Number.isNaN(parsed)) {
								productId = parsed;
							}
						}
						const unitPrice = Math.round((item.amount_total ?? 0) / 100);
						const totalPrice = unitPrice;
						return {
							productId,
							title: item.description ?? "",
							unitPrice,
							totalPrice,
						};
					}) ?? [],
			},
		},
	});

	return order.id;
}

export async function updateOrderStatus(
	orderId: string,
	status: OrderStatus,
): Promise<void> {
	const updateData: {
		status: OrderStatus;
		updatedAt: Date;
		shippedAt?: Date;
		deliveredAt?: Date;
	} = {
		status,
		updatedAt: new Date(),
	};

	if (status === OrderStatus.SHIPPED) {
		updateData.shippedAt = new Date();
	} else if (status === OrderStatus.DELIVERED) {
		updateData.deliveredAt = new Date();
	}

	await prisma.order.update({
		where: { id: orderId },
		data: updateData,
	});
}

export async function getOrderById(orderId: string) {
	return prisma.order.findUnique({
		where: { id: orderId },
		include: {
			items: true,
		},
	});
}

export async function getOrderBySessionId(stripeSessionId: string) {
	return prisma.order.findUnique({
		where: { stripeSessionId },
		include: {
			items: true,
		},
	});
}

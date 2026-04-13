import { OrderStatus } from "@prisma/client";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  // Handle the event
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      await handleCheckoutSessionCompleted(session);
      break;
    }
    case "checkout.session.expired": {
      // Optionally handle expired sessions
      break;
    }
    // Add other event types as needed
    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}

async function handleCheckoutSessionCompleted(
  session: Stripe.Checkout.Session,
) {
  // Check if order already exists for this session
  const existingOrder = await prisma.order.findUnique({
    where: { stripeSessionId: session.id },
  });

  if (existingOrder) {
    console.log(`Order already exists for session ${session.id}`);
    return;
  }

  // Retrieve the session with line items expanded
  const expandedSession = await stripe.checkout.sessions.retrieve(session.id, {
    expand: ["line_items", "line_items.data.price.product"],
  });

  const shipping = expandedSession.collected_information?.shipping_details;
  const customerEmail = expandedSession.customer_details?.email;
  const customerName = expandedSession.customer_details?.name;

  if (!shipping || !customerEmail) {
    console.error("Missing shipping or customer email for session", session.id);
    return;
  }

  const totalAmount = expandedSession.amount_total ?? 0;
  const currency = expandedSession.currency ?? "sek";

  // Extract userId from session metadata (if present)
  const userId = expandedSession.metadata?.userId;

  // Determine order status based on Stripe payment status
  const isPaid =
    expandedSession.payment_status === "paid" ||
    expandedSession.payment_status === "no_payment_required";
  const orderStatus = isPaid ? OrderStatus.PAID : OrderStatus.PENDING;

  // Create order with items
  await prisma.order.create({
    data: {
      stripeSessionId: expandedSession.id,
      customerEmail,
      customerName: customerName ?? undefined,
      totalAmount: Math.round(totalAmount / 100),
      currency,
      status: orderStatus,
      paidAt: isPaid ? new Date() : undefined,
      ...(userId && { userId }),

      shippingName: shipping.name ?? "",
      shippingLine1: shipping.address?.line1 ?? "",
      shippingLine2: shipping.address?.line2 ?? undefined,
      shippingCity: shipping.address?.city ?? "",
      shippingState: shipping.address?.state ?? undefined,
      shippingPostal: shipping.address?.postal_code ?? "",
      shippingCountry: shipping.address?.country ?? "",

      items: {
        create:
          expandedSession.line_items?.data.map((item) => {
            const productIdStr = item.price?.metadata?.productId;
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

  const lineItems = expandedSession.line_items?.data ?? [];

  const productIds = lineItems
    .map((item) => {
      const productIdStr = item.price?.metadata?.productId;
      const productIdFromProduct = (
        item.price?.product as Stripe.Product | undefined
      )?.metadata?.productId;
      const finalProductIdStr = productIdStr || productIdFromProduct;

      if (finalProductIdStr) {
        const parsed = parseInt(finalProductIdStr, 10);
        if (!Number.isNaN(parsed)) {
          return parsed;
        }
      }
      return null;
    })
    .filter((id): id is number => id !== null);

  if (productIds.length > 0) {
    await prisma.product.updateMany({
      where: { id: { in: productIds } },
      data: { availabilityStatus: "Sold" },
    });
  }

  console.log(`Order created for session ${session.id}`);
}

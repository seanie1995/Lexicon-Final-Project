import { createClient } from "@supabase-lib/supabase/server";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@repo/db";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: Request) {
  const { items } = await request.json();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const userId = user?.id;

  if (!items || items.length === 0) {
    return NextResponse.json({ error: "No items in cart" }, { status: 400 });
  }

  const itemIds = items.map((item: { id: number }) => item.id);
  const dbItems = await prisma.product.findMany({
    where: { id: { in: itemIds } },
    select: { id: true, title: true, availabilityStatus: true },
  });

  const unavailableItems = dbItems
    .filter((item) => item.availabilityStatus === "Sold")
    .map((item) => ({ id: item.id, title: item.title }));

  if (unavailableItems.length > 0) {
    return NextResponse.json(
      { error: "unavailable", items: unavailableItems },
      { status: 409 }
    );
  }

  // Map our cart item to sessioncreate params, line by line
  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = items.map(
    (item: {
      id: number;
      title: string;
      price: number;
      thumbnail?: string;
      images?: string[];
    }) => {
      // Will be shown as product image on stripe checkout
      const image = item.thumbnail || (item.images?.[0] ?? undefined);

      return {
        price_data: {
          currency: "sek",
          product_data: {
            name: item.title,
            ...(image && { images: [image] }),
            metadata: {
              productId: item.id.toString(),
            },
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: 1,
      };
    },
  );

  // Creates the checkout session with our previously created items, sets payment mode and supported methods
  // Also includes the success URL on our site when payment is completed.
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: lineItems,
    mode: "payment",
    shipping_address_collection: {
      allowed_countries: ["SE"],
    },
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout`,
    metadata: {
      ...(userId && { userId }),
    },
  });

  return NextResponse.json({ url: session.url, sessionId: session.id });
}

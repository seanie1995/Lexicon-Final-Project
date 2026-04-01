import { ArrowRight, CheckCircle, MapPin } from "lucide-react";
import Link from "next/link";
import Stripe from "stripe";
import { formatPrice } from "@/lib/formatters";
import { ClearCartOnMount } from "./clear-cart";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export default async function SuccessPage({
	searchParams,
}: {
	searchParams: Promise<{ session_id?: string }>;
}) {
	const { session_id } = await searchParams;

	if (!session_id) {
		return (
			<div className="min-h-screen pt-32 pb-20 px-8 flex flex-col items-center justify-center bg-background">
				<p className="font-body text-secondary">No session found.</p>
			</div>
		);
	}

	const session = await stripe.checkout.sessions.retrieve(session_id, {
		expand: ["line_items"],
	});

	const shipping = session.collected_information?.shipping_details;

	return (
		<div className="min-h-screen pt-32 pb-20 px-8 flex flex-col items-center justify-center bg-background">
			<ClearCartOnMount />
			<div className="max-w-lg w-full text-center space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
				<div className="mx-auto w-20 h-20 rounded-full bg-green-50 flex items-center justify-center">
					<CheckCircle className="w-10 h-10 text-green-600" />
				</div>

				<div className="space-y-4">
					<h1 className="text-4xl font-headline italic text-primary">
						Payment Successful
					</h1>
					<p className="font-body text-secondary leading-relaxed">
						Thank you for your purchase! A confirmation email will be sent to{" "}
						<span className="font-bold">{session.customer_details?.email}</span>
						.
					</p>
				</div>

			<div className="bg-surface-container-lowest border border-primary/10 p-8 space-y-4 text-left">
				<h2 className="font-headline text-xl italic text-primary border-b border-primary/10 pb-3">
					Order Summary
				</h2>
					{session.line_items?.data.map((item) => (
						<div
							key={item.id}
							className="flex justify-between items-center text-secondary"
						>
							<span className="font-body">{item.description}</span>
							<span className="font-body font-medium">
								{formatPrice((item.amount_total ?? 0) / 100)} SEK
							</span>
						</div>
					))}
					<div className="flex justify-between items-baseline pt-4 border-t border-primary/10">
						<span className="font-label text-sm uppercase tracking-[0.2em] text-primary font-bold">
							Total Paid
						</span>
						<span className="text-2xl font-headline text-primary font-bold">
							{formatPrice((session.amount_total ?? 0) / 100)} SEK
						</span>
					</div>
				</div>

				{shipping && (
				<div className="bg-surface-container-lowest border border-primary/10 p-8 space-y-4 text-left">
					<h2 className="font-headline text-xl italic text-primary border-b border-primary/10 pb-3 flex items-center gap-3">
						<MapPin className="w-5 h-5" />
						Shipping Details
					</h2>
						<div className="space-y-2 text-secondary">
							<p className="font-body font-medium">{shipping.name}</p>
							<p className="font-body">{shipping.address.line1}</p>
							{shipping.address.line2 && (
								<p className="font-body">{shipping.address.line2}</p>
							)}
							<p className="font-body">
								{shipping.address.postal_code} {shipping.address.city}
							</p>
							<p className="font-body">
								{shipping.address.state && `${shipping.address.state}, `}
								{shipping.address.country}
							</p>
						</div>
					</div>
				)}

				<Link
					href="/"
					className="inline-flex items-center gap-2 font-label text-sm uppercase tracking-widest text-primary hover:gap-4 transition-all group"
				>
					Continue Browsing
					<ArrowRight className="w-4 h-4" />
				</Link>
			</div>
		</div>
	);
}

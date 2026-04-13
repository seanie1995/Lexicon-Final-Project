import type { Metadata } from "next";

 {/*Checkout page is a client component so metadata lives here instead; similar to contact page.
    **Next.js picks this up automatically for the checkout route...*/}
export const metadata: Metadata = {
	title: "Checkout | The Digital Archivist",
	description: "Complete your purchase securely through The Digital Archivist.",
};

export default function CheckoutLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return <>{children}</>;
}

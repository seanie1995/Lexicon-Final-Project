import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/header";
import { CartProvider } from "@/lib/contexts/cart-context";

export const metadata: Metadata = {
  title: "Webshop",
  description: "Literature webshop",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <CartProvider>
          <Header />
          <main>{children}</main>
        </CartProvider>
      </body>
    </html>
  );
}

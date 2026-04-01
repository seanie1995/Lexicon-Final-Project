import type { Metadata } from "next";
import "./globals.css";
import Footer from "@/components/footer";
import Header from "@/components/header";
import { CartProvider } from "@/lib/contexts/cart-context";
import { ThemeProvider } from "@/lib/contexts/theme-context";

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
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var t=localStorage.getItem("theme");if(t)document.documentElement.classList.add(t)})();`,
          }}
        />
      </head>
      <body className="antialiased">
        <ThemeProvider>
          <CartProvider>
            <Header />
            <main>{children}</main>
            <Footer />
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

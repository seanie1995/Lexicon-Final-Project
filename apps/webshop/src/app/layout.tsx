import { Suspense } from "react";
import type { Metadata } from "next";
import "./globals.css";
import Footer from "@/components/footer";
import Header from "@/components/header";
import { CartProvider } from "@/lib/contexts/cart-context";
import { ThemeProvider } from "@/lib/contexts/theme-context";

function ProvidersSkeleton() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-on-surface-variant font-body italic">Loading...</p>
      </div>
    </div>
  );
}

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
        <Suspense fallback={<ProvidersSkeleton />}>
          <ThemeProvider>
            <CartProvider>
              <Header />
              <main>{children}</main>
              <Footer />
            </CartProvider>
          </ThemeProvider>
        </Suspense>
      </body>
    </html>
  );
}

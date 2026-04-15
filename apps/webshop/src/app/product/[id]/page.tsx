import { ArrowLeft, FileText } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductById } from "@/lib/actions/products";
import { formatPrice } from "@/lib/formatters";
import AddToCartButton from "@/components/add-to-cart-button";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const product = await getProductById(Number(id));

  if (!product) {
    return { title: "Product Not Found" };
  }

  const images = Array.isArray(product.images)
    ? (product.images as string[])
    : [];

  const mainImage = images[0] || product.thumbnail;

  return {
    title: `${product.title} by ${product.author.name}`,
    description: product.description,
    openGraph: {
      title: `${product.title} by ${product.author.name}`,
      description: product.description,
      images: [mainImage],
    },
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { id } = await params;
  const product = await getProductById(Number(id));

  if (!product) notFound();

  const isAvailable = product.availabilityStatus !== "Sold";

  const images = Array.isArray(product.images)
    ? (product.images as string[])
    : [];

  const mainImage = images[0] || product.thumbnail;

  return (
    <main className="min-h-screen bg-surface pt-24">

      {/* HEADER / HERO */}
      <section className="mx-auto max-w-screen-2xl px-8 py-20 lg:px-12">

        {/* Back navigation */}
        <nav aria-label="Breadcrumb" className="mb-12">
          <Link
            href="/catalog"
            aria-label="Return to catalog"
            className="inline-flex items-center text-secondary font-label text-sm hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" aria-hidden="true" />
            Return to Catalog
          </Link>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">

          {/* IMAGE */}
          <div className="lg:col-span-7">
            <div className="relative aspect-[4/5] bg-surface-container-low overflow-hidden">
              <Image
                src={mainImage}
                alt={`Cover of ${product.title} by ${product.author.name}`}
                className="object-cover"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 60vw"
              />
            </div>
          </div>

          {/* PRODUCT INFO */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            <div className="space-y-8">

              <header>
                <p className="font-label text-sm uppercase tracking-[0.2em] text-secondary mb-4">
                  Ref. No: DA-{product.year.getFullYear()}-{product.id}
                </p>

                <h1 className="font-headline text-5xl md:text-6xl text-on-surface leading-tight mb-4">
                  {product.title}
                </h1>

                <p className="font-headline italic text-2xl text-secondary">
                  By {product.author.name}
                </p>
              </header>

              <div className="h-px w-24 bg-outline-variant/30" />

              <p className="font-body text-lg text-on-surface-variant leading-relaxed">
                {product.description}
              </p>

              {/* PRICE */}
              <div className="bg-surface-container-low p-8 space-y-4">
                <div className="flex justify-between items-baseline">
                  <span className="font-label text-sm text-secondary">
                    Market Value
                  </span>
                  <span className="font-headline text-3xl text-primary">
                    {formatPrice(product.price)} SEK
                  </span>
                </div>
                <p className="font-label text-xs text-on-surface-variant italic">
                  Inclusive of certified archival assessment and provenance ledger.
                </p>
              </div>

              {/* CTA */}
              <div className="pt-4">
                <AddToCartButton
                  product={product}
                  available={isAvailable}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DETAILS */}
      <section className="bg-surface-container-low px-8 py-24 lg:px-12">
        <div className="mx-auto max-w-screen-2xl grid grid-cols-1 lg:grid-cols-12 gap-16">

          {/* LEFT COLUMN */}
          <div className="lg:col-span-4 space-y-16">

            <section aria-labelledby="specs-heading">
              <h2 id="specs-heading" className="font-headline text-2xl mb-8">
                Specifications
              </h2>
              <ul className="space-y-6">
                <SpecItem label="Publisher" value={product.publisher.name} />
                <SpecItem label="Year" value={product.year.getFullYear().toString()} />
                <SpecItem label="Format" value={product.format} />
                <SpecItem label="Genre" value={product.genre} />
                <SpecItem label="Binding" value={product.binding} />
              </ul>
            </section>

            <section aria-labelledby="shipping-heading">
              <h2 id="shipping-heading" className="font-headline text-2xl mb-8">
                Shipping & Delivery
              </h2>
              <ul className="space-y-6">
                <SpecItem label="Method" value="Premium Insured Courier" />
                <SpecItem label="Delivery" value={product.shippingInformation} />
                <SpecItem label="Cost" value="Complimentary" />
              </ul>
            </section>

            <aside className="p-8 border-l-2 border-primary bg-surface-container-lowest">
              <p className="font-body italic text-on-surface-variant leading-relaxed">
                "The Digital Archivist's seal confirms this volume remains preserved in exceptional condition."
              </p>
            </aside>
          </div>

          {/* RIGHT COLUMN */}
          <div className="lg:col-span-8 space-y-24">

            {/* CONDITION */}
            <section aria-labelledby="condition-heading">
              <div className="flex items-center gap-x-4 mb-8">
                <h2 id="condition-heading" className="font-headline text-3xl">
                  Condition Report
                </h2>
                <span className="px-3 py-1 bg-surface-container-highest text-secondary font-label text-[10px] uppercase tracking-widest">
                  Grade: {product.condition.grade}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div>
                  <h3 className="font-label text-sm uppercase tracking-widest mb-2">
                    Exterior
                  </h3>
                  <p className="text-on-surface-variant">
                    {product.condition.exterior}
                  </p>
                </div>

                <div>
                  <h3 className="font-label text-sm uppercase tracking-widest mb-2">
                    Interior
                  </h3>
                  <p className="text-on-surface-variant">
                    {product.condition.interior}
                  </p>
                </div>
              </div>
            </section>

            {/* PROVENANCE */}
            <section
              aria-labelledby="provenance-heading"
              className="bg-surface-container-low p-12"
            >
              <h2 id="provenance-heading" className="font-headline text-3xl mb-8">
                History & Provenance
              </h2>

              <p className="text-on-surface-variant mb-6">
                {product.author.description}
              </p>

             <p className="font-label text-sm text-on-surface-variant italic leading-relaxed">
  Provenance documentation available upon request.
</p>
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}

function SpecItem({ label, value }: { label: string; value: string }) {
  return (
    <li className="flex justify-between border-b border-outline-variant/10 pb-2">
      <span className="font-label text-xs uppercase tracking-widest text-secondary">
        {label}
      </span>
      <span className="text-on-surface">{value}</span>
    </li>
  );
}
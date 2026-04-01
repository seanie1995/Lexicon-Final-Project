import Link from "next/link";
import ProductCard from "@/components/product-card";
import { getProducts } from "@/lib/actions/products";

const HomeFeaturedBooks = async () => {
    const { data: books } = await getProducts({

        // TODO: Change this to only A+ condition grades (or other we want to filter on)
        conditionGrades: ["A+", "A"],
        // Show only 5 books
        pageSize: 5,
    });

    return (
        <section className="overflow-hidden bg-surface-container-low py-24">
            <header className="mb-12 flex items-end justify-between px-6 lg:px-20">
                <div className="space-y-2">
                    <p className="font-label text-xs uppercase tracking-[0.3em] text-secondary">
                        The Collection
                    </p>
                    <h2 className="font-headline text-4xl font-bold text-on-surface">
                        Featured Rarities
                    </h2>
                </div>
                <Link
                    href="/catalog"
                    className="font-label text-xs uppercase tracking-widest text-primary border-b border-primary pb-1 transition-colors hover:text-primary-container"
                >
                    View Full Catalog
                </Link>
            </header>

            <div className="flex gap-10 overflow-x-auto px-6 pb-10 lg:px-20 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {books.map((book) => (
                    <article key={book.id} className="min-w-[300px]">
                        <ProductCard product={book} />
                    </article>
                ))}
            </div>
        </section>
    );
};

export default HomeFeaturedBooks;
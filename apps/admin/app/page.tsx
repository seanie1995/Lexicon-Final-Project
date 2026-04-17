import Sidebar from "@/components/sidebar";
import ProductFilterForm from "../components/form/product-filter-form";
import ProductTable from "@/components/product-table/product-table";
import PageHeader from "@/components/header/page-header";
import Pagination from "@/components/pagination/pagination";
import EmptyState from "../components/form/empty-state";
import { getProducts, getProductStatusCounts } from "@/lib/actions/products";
import { getCategories, getConditions, getAuthors, getPublishers } from "@/lib/actions/lookups";

const defaultLimit = 6;

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{
    search?: string;
    category?: string;
    status?: string;
    page?: string;
  }>;
}) {
  const params = await searchParams;
  const search = params?.search || "";
  const category = params?.category || "";
  const status = params?.status || "";
  const currentPage = Number(params?.page) || 1;

  const [categories, conditions, authors, publishers, statusCounts, { data: products, total, totalPages }] = await Promise.all([
    getCategories(),
    getConditions(),
    getAuthors(),
    getPublishers(),
    getProductStatusCounts(),
    getProducts(
      currentPage,
      defaultLimit,
      search,
      category ? parseInt(category, 10) : undefined,
      status || undefined,
    ),
  ]);

  const { totalProducts, inStock, sold } = statusCounts;

  return (
    <div className="min-h-screen md:grid md:[grid-template-areas:'sidebar_header_header''sidebar_form_form''sidebar_main_main'] md:[grid-template-columns:auto_1fr_1fr]">
      <Sidebar className="md:[grid-area:sidebar]" />
      <PageHeader
        totalProducts={totalProducts}
        inStock={inStock}
        sold={sold}
        categories={categories}
        conditions={conditions}
        authors={authors}
        publishers={publishers}
      />
      <main className="min-h-screen md:[grid-area:main] p-6">
        <ProductFilterForm
          categories={categories}
          search={search}
          category={category}
          status={status}
        />
        {products.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="mt-4 border rounded-xl border-neutral-200 overflow-hidden">
            <ProductTable products={products} />
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalProducts={total}
              productsPerPage={defaultLimit}
            />
          </div>
        )}
      </main>
    </div>
  );
}

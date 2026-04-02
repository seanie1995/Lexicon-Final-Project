import type { ProductsResponse } from "@/lib/types/product";
import Sidebar from "@/components/sidebar";
import ProductFilterForm from "../components/form/product-filter-form";
import ProductTable from "@/components/product-table/product-table";
import PageHeader from "@/components/header/page-header";
import Pagination from "@/components/pagination/pagination";
import EmptyState from "../components/form/empty-state";

const API_URL = "http://localhost:4000";
const defaultLimit = "6";

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

  const categories = await fetch(`${API_URL}/categories`, {
    cache: "no-store",
  }).then((res) => res.json());

  let query = `_limit=${defaultLimit}&_sort=id&_order=desc&_expand=category&_page=${currentPage}`;

  if (search) query += `&q=${search}`;
  if (category) query += `&categoryId=${category}`;
  if (status) query += `&availabilityStatus=${status}`;

  // Fetch current page of products for the table
  const { products, total, page, pages, limit }: ProductsResponse = await fetch(
    `${API_URL}/products?${query}`,
  ).then((res) => res.json());

  // Fetch ALL products to count stats
  const { products: allProducts }: ProductsResponse = await fetch(
    `${API_URL}/products?_limit=1000&_expand=category`,
    { cache: "no-store" }
  ).then((res) => res.json());

  // Count each status from real data
  const totalProducts = allProducts.length;
  const inStock = allProducts.filter(
    (p) => p.availabilityStatus?.toLowerCase() === "in stock"
  ).length;
  const lowStock = allProducts.filter(
    (p) => p.availabilityStatus?.toLowerCase() === "low stock"
  ).length;
  const outOfStock = allProducts.filter(
    (p) => p.availabilityStatus?.toLowerCase() === "out of stock"
  ).length;

  return (
    <div
      className="min-h-screen md:grid 
      md:[grid-template-areas:'sidebar_header_header''sidebar_form_form''sidebar_main_main']"
    >
      <Sidebar className="md:[grid-area:sidebar]" />

      {/* Added this - Pass real stats to PageHeader */}
      <PageHeader
        totalProducts ={totalProducts}
        inStock={inStock}
        lowStock={lowStock}
        outOfStock={outOfStock}
      />

      <main className="min-h-screen md:[grid-area:main] p-6">

        {/* TEAMMATE's addition - passes categories and filters */}
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
              totalPages={pages}
              totalProducts={total}
              productsPerPage={Number(defaultLimit)}
            />
          </div>
        )}
      </main>
    </div>
  );
}
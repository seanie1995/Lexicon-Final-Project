import Sidebar from "@/components/sidebar";
import OrderTable from "@/components/order-table/order-table";
import { getOrders } from "@/lib/actions/orders";

const defaultLimit = 10;

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; status?: string }>;
}) {
  const params = await searchParams;
  const currentPage = Number(params?.page) || 1;
  const status = params?.status || "";

  const { data: orders, totalPages, total } = await getOrders(
    currentPage,
    defaultLimit,
    status || undefined,
  );

  return (
    <div className="min-h-screen md:grid md:[grid-template-areas:'sidebar_header''sidebar_main']">
      <Sidebar className="md:[grid-area:sidebar]" />
      <header className="border-b border-neutral-200 p-6">
        <h1 className="text-2xl font-semibold">Orders</h1>
        <p className="text-sm text-gray-500">{total} total orders</p>
      </header>
      <main className="min-h-screen md:[grid-area:main] p-6">
        {orders.length === 0 ? (
          <div className="text-center py-12 text-gray-500">No orders found.</div>
        ) : (
          <div className="border rounded-xl border-neutral-200 overflow-hidden">
            <OrderTable orders={orders} />
          </div>
        )}
      </main>
    </div>
  );
}

import Sidebar from "@/components/sidebar";
import OrderDetail from "@/components/order-detail/order-detail";
import { getOrderById } from "@/lib/actions/orders";

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await getOrderById(id);

  if (!order) {
    return <h1>Order not found</h1>;
  }

  return (
    <div className="min-h-screen md:grid md:[grid-template-areas:'sidebar_header''sidebar_main'] md:[grid-template-columns:auto_1fr]">
      <Sidebar className="md:[grid-area:sidebar]" />
      <header className="border-b border-neutral-200 p-6">
        <h1 className="text-2xl font-semibold">Order: {order.id.slice(0, 8)}</h1>
      </header>
      <main className="min-h-screen md:[grid-area:main] p-6">
        <OrderDetail order={order} />
      </main>
    </div>
  );
}

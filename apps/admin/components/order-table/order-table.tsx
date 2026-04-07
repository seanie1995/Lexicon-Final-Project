import type { OrderWithItems } from "@/lib/types/product";
import OrderTableRow from "./order-table-row";

interface OrdersTableProps {
  orders: (OrderWithItems & { items: { id: string }[] })[];
}

export default function OrderTable({ orders }: OrdersTableProps) {
  return (
    <table className="w-full">
      <thead className="border-b border-neutral-200">
        <tr className="bg-neutral-50">
          <th className="p-4 text-xs text-neutral-500">Order ID</th>
          <th className="p-4 text-xs text-neutral-500">Customer</th>
          <th className="p-4 text-xs text-neutral-500">Items</th>
          <th className="p-4 text-xs text-neutral-500">Total</th>
          <th className="p-4 text-xs text-neutral-500">Status</th>
          <th className="p-4 text-xs text-neutral-500">Date</th>
          <th className="p-4 text-xs text-neutral-500">Actions</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-neutral-200 bg-white">
        {orders.map((order) => (
          <OrderTableRow key={order.id} order={order} />
        ))}
      </tbody>
    </table>
  );
}

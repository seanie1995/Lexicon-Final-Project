import Link from "next/link";
import type { OrderWithItems } from "@/lib/types/product";
import StatusBadge from "@/components/order-detail/status-badge";

interface OrderTableRowProps {
  order: OrderWithItems & { items: { id: string }[] };
}

export default function OrderTableRow({ order }: OrderTableRowProps) {
  const formattedTotal = Math.round(order.totalAmount).toLocaleString("sv-SE");
  const formattedDate = new Date(order.createdAt).toLocaleDateString("sv-SE");
  const shortId = order.id.slice(0, 8);

  return (
    <tr className="text-center hover:bg-neutral-50">
      <td className="p-4 font-mono text-sm">{shortId}</td>
      <td className="p-4 text-left">{order.customerEmail}</td>
      <td className="p-4">{order.items.length}</td>
      <td className="p-4 font-medium">{formattedTotal} kr</td>
      <td className="p-4">
        <StatusBadge status={order.status} />
      </td>
      <td className="p-4 text-neutral-600">{formattedDate}</td>
      <td className="p-4">
        <Link
          href={`/orders/${order.id}`}
          className="text-purple-600 hover:underline text-sm"
        >
          View
        </Link>
      </td>
    </tr>
  );
}

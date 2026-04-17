import type { OrderStatus } from "@/lib/types/product";

const statusConfig: Record<OrderStatus, { bg: string; text: string }> = {
  PENDING: { bg: "bg-yellow-100", text: "text-yellow-800" },
  PAID: { bg: "bg-blue-100", text: "text-blue-800" },
  SHIPPED: { bg: "bg-purple-100", text: "text-purple-800" },
  DELIVERED: { bg: "bg-green-100", text: "text-green-800" },
  CANCELLED: { bg: "bg-red-100", text: "text-red-800" },
};

export default function StatusBadge({ status }: { status: string }) {
  const config = statusConfig[status as OrderStatus] || {
    bg: "bg-neutral-100",
    text: "text-neutral-800",
  };

  return (
    <span className={`text-xs font-medium px-2 py-1 rounded ${config.bg} ${config.text}`}>
      {status}
    </span>
  );
}

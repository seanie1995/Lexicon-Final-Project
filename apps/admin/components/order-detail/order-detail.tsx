"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateOrderStatus } from "@/lib/actions/orders";
import type { OrderStatus } from "@/lib/types/product";
import StatusBadge from "./status-badge";

interface OrderDetailProps {
  order: {
    id: string;
    customerEmail: string;
    customerName: string | null;
    totalAmount: number;
    currency: string;
    status: string;
    shippingName: string;
    shippingLine1: string;
    shippingLine2: string | null;
    shippingCity: string;
    shippingPostal: string;
    shippingCountry: string;
    createdAt: Date;
    paidAt: Date | null;
    shippedAt: Date | null;
    deliveredAt: Date | null;
    items: {
      id: string;
      title: string;
      unitPrice: number;
      totalPrice: number;
      product: { title: string } | null;
    }[];
  };
}

const allStatuses: OrderStatus[] = ["PENDING", "PAID", "SHIPPED", "DELIVERED", "CANCELLED"];

export default function OrderDetail({ order }: OrderDetailProps) {
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus>(
    order.status as OrderStatus,
  );
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleStatusUpdate() {
    setUpdating(true);
    setError(null);
    try {
      await updateOrderStatus(order.id, selectedStatus);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to update status");
    } finally {
      setUpdating(false);
    }
  }

  const formattedTotal = Math.round(order.totalAmount).toLocaleString("sv-SE");

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <div>
          <h2 className="font-semibold mb-2">Order Info</h2>
          <p><span className="text-neutral-500">ID:</span> {order.id}</p>
          <p><span className="text-neutral-500">Customer:</span> {order.customerEmail}</p>
          {order.customerName && (
            <p><span className="text-neutral-500">Name:</span> {order.customerName}</p>
          )}
          <p><span className="text-neutral-500">Total:</span> {formattedTotal} kr</p>
          <p>
            <span className="text-neutral-500">Status:</span>{" "}
            <StatusBadge status={order.status} />
          </p>
          <p><span className="text-neutral-500">Created:</span> {new Date(order.createdAt).toLocaleString("sv-SE")}</p>
          {order.paidAt && <p><span className="text-neutral-500">Paid:</span> {new Date(order.paidAt).toLocaleString("sv-SE")}</p>}
          {order.shippedAt && <p><span className="text-neutral-500">Shipped:</span> {new Date(order.shippedAt).toLocaleString("sv-SE")}</p>}
          {order.deliveredAt && <p><span className="text-neutral-500">Delivered:</span> {new Date(order.deliveredAt).toLocaleString("sv-SE")}</p>}
        </div>

        <div>
          <h2 className="font-semibold mb-2">Shipping Address</h2>
          <p>{order.shippingName}</p>
          <p>{order.shippingLine1}</p>
          {order.shippingLine2 && <p>{order.shippingLine2}</p>}
          <p>{order.shippingPostal} {order.shippingCity}</p>
          <p>{order.shippingCountry}</p>
        </div>
      </div>

      <div>
        <h2 className="font-semibold mb-2">Update Status</h2>
        {error && <p className="text-red-600 text-sm mb-2">{error}</p>}
        <div className="flex gap-2 items-center">
          <select
            className="border border-neutral-200 p-2 rounded-lg"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as OrderStatus)}
          >
            {allStatuses.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <button
            type="button"
            onClick={handleStatusUpdate}
            disabled={updating || selectedStatus === order.status}
            className="px-4 py-2 bg-purple-900/80 text-white rounded-lg hover:bg-purple-900 disabled:opacity-50"
          >
            {updating ? "Updating..." : "Update Status"}
          </button>
        </div>
      </div>

      <div>
        <h2 className="font-semibold mb-2">Items</h2>
        <table className="w-full">
          <thead className="border-b border-neutral-200">
            <tr className="bg-neutral-50">
              <th className="p-4 text-xs text-neutral-500 text-left">Product</th>
              <th className="p-4 text-xs text-neutral-500">Unit Price</th>
              <th className="p-4 text-xs text-neutral-500">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200">
            {order.items.map((item) => (
              <tr key={item.id}>
                <td className="p-4">{item.title}</td>
                <td className="p-4 text-center">{Math.round(item.unitPrice).toLocaleString("sv-SE")} kr</td>
                <td className="p-4 text-center font-medium">{Math.round(item.totalPrice).toLocaleString("sv-SE")} kr</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

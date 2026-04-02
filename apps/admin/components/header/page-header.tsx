import { Package, CircleCheck, TriangleAlert, CircleX } from "lucide-react";
import StatsCard from "./stats-card";
import AddProductButton from "./add-product-button";

// Added props interface - accepts real numbers from page.tsx
interface PageHeaderProps {
  totalProducts: number;
  inStock: number;
  lowStock: number;
  outOfStock: number;
}

export default function PageHeader({
  totalProducts,
  inStock,
  lowStock,
  outOfStock,
}: PageHeaderProps) {

  // Now uses real data from props instead of hardcoded numbers
  const stats = [
    {
      title: "Total products",
      value: totalProducts,
      icon: Package,
      color: "text-purple-600",
      bg: "bg-purple-100",
    },
    {
      title: "In stock",
      value: inStock,
      icon: CircleCheck,
      color: "text-green-600",
      bg: "bg-green-100",
    },
    {
      title: "Low stock",
      value: lowStock,
      icon: TriangleAlert,
      color: "text-yellow-600",
      bg: "bg-yellow-100",
    },
    {
      title: "Out of stock",
      value: outOfStock,
      icon: CircleX,
      color: "text-red-600",
      bg: "bg-red-100",
    },
  ];

  return (
    <header className="w-full md:[grid-area:header]">
      <section className="flex justify-between border-b border-neutral-200 p-6">
        <div>
          <h1 className="text-2xl font-semibold">Product management</h1>
          <p className="text-sm text-gray-500">Manage your store inventory</p>
        </div>
        <AddProductButton />
      </section>
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
        {stats.map((stat) => (
          <StatsCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            color={stat.color}
            bg={stat.bg}
          />
        ))}
      </section>
    </header>
  );
}
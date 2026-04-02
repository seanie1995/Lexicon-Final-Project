import { Package, CircleCheck, CircleX } from "lucide-react";
import StatsCard from "./stats-card";
import AddProductButton from "./add-product-button";
import type { Category, Condition, Author, Publisher } from "@/lib/types/product";

interface PageHeaderProps {
  totalProducts: number;
  inStock: number;
  sold: number;
  categories: Category[];
  conditions: Condition[];
  authors: Author[];
  publishers: Publisher[];
}

export default function PageHeader({
  totalProducts,
  inStock,
  sold,
  categories,
  conditions,
  authors,
  publishers,
}: PageHeaderProps) {
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
      title: "Sold",
      value: sold,
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
        <AddProductButton
          categories={categories}
          conditions={conditions}
          authors={authors}
          publishers={publishers}
        />
      </section>
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
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

import { PlusIcon } from "lucide-react";
import Link from "next/link";

export default function AddProductLink() {
  return (
    <Link
      href="/products/add"
      className="bg-purple-900/80 text-white p-3 h-fit rounded-lg hover:bg-purple-900/85 transition"
    >
      <span className="flex items-center justify-center gap-1">
        <PlusIcon />
        Add product
      </span>
    </Link>
  );
}

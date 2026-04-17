"use client";

import { Search } from "lucide-react";

type Props = {
  search: string;
};

export default function SearchInput({ search }: Props) {
  return (
    <div className="relative flex-1 w-full">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
      <input
        type="text"
        name="search"
        defaultValue={search}
        placeholder="Search products..."
        className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-gray-200"
      />
    </div>
  )
}
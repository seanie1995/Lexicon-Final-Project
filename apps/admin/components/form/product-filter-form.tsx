"use client";

import Form from "next/form";
import SearchInput from "./search-input";
import FilterControls from "./filter-controls";

type Category = {
  id: number;
  name: string;
};

type Props = {
  categories: Category[];
  search: string;
  category: string;
  status: string;
};

export default function ProductFilterForm({
  categories,
  search,
  category,
  status,
}: Props) {
  return (
    <Form action="/" className="flex border border-gray-300 rounded-lg p-3 items-center gap-4 w-full">
      <SearchInput search={search} />
      <FilterControls 
        categories={categories}
        category={category}
        status={status}
      />
    </Form>
  );
}


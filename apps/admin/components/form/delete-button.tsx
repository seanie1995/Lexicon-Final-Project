import Form from "next/form";
import { deleteProduct } from "@/lib/actions/products";
import { Trash2 } from "lucide-react";

export function DeleteButton({ id }: { id: number }) {
  const deleteAction = deleteProduct.bind(null, id);

  return (
    <Form action={deleteAction}>
      <button
        type="submit"
        className="p-1.5 rounded-md hover:bg-neutral-100 text-red-600 cursor-pointer"
      >
        <Trash2 size={16} />
      </button>
    </Form>
  );
}

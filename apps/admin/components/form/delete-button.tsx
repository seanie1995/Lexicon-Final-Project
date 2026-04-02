import Form from "next/form";
import { deleteProductAPI } from "@/lib/actions";
import { Trash2 } from "lucide-react";

// With bind we instead pass on/bind our id to the form and pass it along this way
// doing this we can skip the hidden input
// https://nextjs.org/docs/app/guides/forms#passing-additional-arguments
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind

export function DeleteButton({ id }: { id: number }) {

  // we bind the id to the deleteProductAPI function and pass that as the action to the form
  // this way when the form is submitted it will call deleteProductAPI with the correct id
  const deleteProductAction = deleteProductAPI.bind(null, id);

  return (
    <Form action={deleteProductAction}>
        <button type="submit" className="p-1.5 rounded-md hover:bg-neutral-100 text-red-600 cursor-pointer">
            <Trash2 size={16} />
        </button>
    </Form>
  );
}
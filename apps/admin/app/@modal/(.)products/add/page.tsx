import AddProductPage from "@/app/products/add/page";
import { Modal } from "@/components/global";

export default async function EditModal() {
  return (
    <Modal>
      {/* should be replace with edit form/edit page component*/}
      <AddProductPage />
    </Modal>
  );
}

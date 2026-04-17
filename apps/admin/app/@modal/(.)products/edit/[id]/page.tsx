import EditProductPage from "@/app/products/edit/[id]/page";
import { Modal } from "@/components/global";

export default async function EditModal({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Modal>
      {/* should be replace with edit form/edit page component*/}
      <EditProductPage params={params} />
    </Modal>
  );
}

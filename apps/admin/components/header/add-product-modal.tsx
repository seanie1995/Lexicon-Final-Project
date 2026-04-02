// Just added to show that its parent is a use client, and therefore this is a use client too.
"use client";

import AddProductForm from "../form/add-product-form";

type AddProductModalProps = {
    onClose: () => void;
};

export default function AddProductModal({ onClose }: AddProductModalProps) {

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
            <div className="bg-white p-6 rounded-xl w-96 shadow-lg">
                <h2 className="text-xl font-semibold mb-6">Add new product</h2>
                <AddProductForm />
                <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 rounded-lg border"
                >
                    Cancel
                </button>
            </div>
        </div>
    );
}
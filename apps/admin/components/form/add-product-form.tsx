import Form from "next/form";
import { addProductAPI } from "@/lib/actions";

export default function AddProductForm() {
    return (
        <Form action={addProductAPI} className="py-2">
            <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 items-center">
                <label className="font-semibold" htmlFor="title">
                    Title
                </label>
                <input
                    className="border border-neutral-200 p-2 rounded-lg"
                    type="text"
                    id="title"
                    name="title"
                    minLength={3}
                    maxLength={20}
                    required
                />
                <label className="font-semibold" htmlFor="brand">
                    Brand
                </label>
                <input
                    className="border border-neutral-200 p-2 rounded-lg"
                    type="text"
                    id="brand"
                    name="brand"
                    required
                />
                <label className="font-semibold" htmlFor="price">
                    Price
                </label>
                <input
                    className="border border-neutral-200 p-2 rounded-lg"
                    type="number"
                    min="0.5"
                    step="0.01"
                    id="price"
                    name="price"
                    required
                />
                <label className="font-semibold" htmlFor="stock">
                    Stock
                </label>
                <input
                    className="border border-neutral-200 p-2 rounded-lg"
                    type="number"
                    id="stock"
                    name="stock"
                    required
                />
                <label className="font-semibold" htmlFor="categoryId">
                    Category ID
                </label>
                <input
                    className="border border-neutral-200 p-2 rounded-lg"
                    type="number"
                    id="categoryId"
                    name="categoryId"
                    required
                />
                <label className="font-semibold" htmlFor="description">
                    Description
                </label>
                <textarea
                    className="border border-neutral-200 p-2 rounded-lg"
                    id="description"
                    name="description"
                    minLength={5}
                    maxLength={400}
                    required
                />
                <label className="font-semibold" htmlFor="thumbnail">
                    Thumbnail
                </label>
                <input
                    className="border border-neutral-200 p-2 rounded-lg"
                    type="url"
                    id="thumbnail"
                    name="thumbnail"
                    required
                />
            </div>
            <button
                type="submit"
                className="px-4 py-2 mt-2 rounded-lg border"
            >
                Save
            </button>
        </Form>

    );
};

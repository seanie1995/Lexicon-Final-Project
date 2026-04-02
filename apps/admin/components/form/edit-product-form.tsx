import Form from "next/form";
import type { Product } from "@/lib/types/product";
import { updateProductAPI } from "@/lib/actions";


export default function EditProductForm({ product }: { product: Product }) {
    return (
        <Form action={updateProductAPI} className="py-2">
            {/* Send id with the form */}
            <input readOnly name="id" value={product.id} hidden />
            
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
                    defaultValue={product.title}
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
                    defaultValue={product.brand}
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
                    defaultValue={product.price}
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
                    defaultValue={product.stock}
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
                    defaultValue={product.categoryId}
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
                    defaultValue={product.description}
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
                    defaultValue={product.thumbnail}
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

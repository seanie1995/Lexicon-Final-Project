import Form from "next/form";
import { createProduct } from "@/lib/actions/products";
import type { Category, Condition, Author, Publisher } from "@/lib/types/product";

interface AddProductFormProps {
  categories: Category[];
  conditions: Condition[];
  authors: Author[];
  publishers: Publisher[];
}

export default function AddProductForm({
  categories,
  conditions,
  authors,
  publishers,
}: AddProductFormProps) {
  return (
    <Form action={createProduct} className="py-2">
      <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 items-center">
        <label className="font-semibold" htmlFor="title">Title</label>
        <input className="border border-neutral-200 p-2 rounded-lg" type="text" id="title" name="title" required />

        <label className="font-semibold" htmlFor="description">Description</label>
        <textarea className="border border-neutral-200 p-2 rounded-lg" id="description" name="description" required />

        <label className="font-semibold" htmlFor="price">Price (ore)</label>
        <input className="border border-neutral-200 p-2 rounded-lg" type="number" id="price" name="price" min="0" required />

        <label className="font-semibold" htmlFor="discountPercentage">Discount %</label>
        <input className="border border-neutral-200 p-2 rounded-lg" type="number" id="discountPercentage" name="discountPercentage" min="0" max="100" defaultValue="0" />

        <label className="font-semibold" htmlFor="thumbnail">Thumbnail URL</label>
        <input className="border border-neutral-200 p-2 rounded-lg" type="url" id="thumbnail" name="thumbnail" />

        <label className="font-semibold" htmlFor="images">Images (JSON array)</label>
        <input className="border border-neutral-200 p-2 rounded-lg" type="text" id="images" name="images" defaultValue="[]" placeholder='["url1","url2"]' />

        <label className="font-semibold" htmlFor="tags">Tags (JSON array)</label>
        <input className="border border-neutral-200 p-2 rounded-lg" type="text" id="tags" name="tags" defaultValue="[]" placeholder='["tag1","tag2"]' />

        <label className="font-semibold" htmlFor="era">Era</label>
        <input className="border border-neutral-200 p-2 rounded-lg" type="text" id="era" name="era" />

        <label className="font-semibold" htmlFor="genre">Genre</label>
        <input className="border border-neutral-200 p-2 rounded-lg" type="text" id="genre" name="genre" />

        <label className="font-semibold" htmlFor="format">Format</label>
        <input className="border border-neutral-200 p-2 rounded-lg" type="text" id="format" name="format" />

        <label className="font-semibold" htmlFor="year">Year</label>
        <input className="border border-neutral-200 p-2 rounded-lg" type="date" id="year" name="year" />

        <label className="font-semibold" htmlFor="binding">Binding</label>
        <input className="border border-neutral-200 p-2 rounded-lg" type="text" id="binding" name="binding" />

        <label className="font-semibold" htmlFor="weight">Weight (g)</label>
        <input className="border border-neutral-200 p-2 rounded-lg" type="number" id="weight" name="weight" min="0" defaultValue="0" />

        <label className="font-semibold" htmlFor="warrantyInformation">Warranty</label>
        <input className="border border-neutral-200 p-2 rounded-lg" type="text" id="warrantyInformation" name="warrantyInformation" />

        <label className="font-semibold" htmlFor="shippingInformation">Shipping</label>
        <input className="border border-neutral-200 p-2 rounded-lg" type="text" id="shippingInformation" name="shippingInformation" />

        <label className="font-semibold" htmlFor="availabilityStatus">Status</label>
        <select className="border border-neutral-200 p-2 rounded-lg" id="availabilityStatus" name="availabilityStatus">
          <option value="In Stock">In Stock</option>
          <option value="Low Stock">Low Stock</option>
          <option value="Out of Stock">Out of Stock</option>
        </select>

        <label className="font-semibold" htmlFor="categoryId">Category</label>
        <select className="border border-neutral-200 p-2 rounded-lg" id="categoryId" name="categoryId" required>
          <option value="">Select category</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>

        <label className="font-semibold" htmlFor="conditionId">Condition</label>
        <select className="border border-neutral-200 p-2 rounded-lg" id="conditionId" name="conditionId" required>
          <option value="">Select condition</option>
          {conditions.map((c) => (
            <option key={c.id} value={c.id}>{c.grade} -- {c.exterior}/{c.interior}</option>
          ))}
        </select>

        <label className="font-semibold" htmlFor="authorId">Author</label>
        <select className="border border-neutral-200 p-2 rounded-lg" id="authorId" name="authorId" required>
          <option value="">Select author</option>
          {authors.map((a) => (
            <option key={a.id} value={a.id}>{a.name}</option>
          ))}
        </select>

        <label className="font-semibold" htmlFor="publisherId">Publisher</label>
        <select className="border border-neutral-200 p-2 rounded-lg" id="publisherId" name="publisherId" required>
          <option value="">Select publisher</option>
          {publishers.map((p) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
      </div>
      <button type="submit" className="px-4 py-2 mt-2 rounded-lg border">
        Save
      </button>
    </Form>
  );
}

"use server"

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// In this server action we get the id directly and pass that along to the API
// we then call revalidatePath to revalidate the cache for the homepage so that the deleted product is removed from the list
export async function deleteProductAPI(id: number) {
    //  const res = await fetch(`${API_URL}/products/${id}`, {

    // Hardcoded for now, in a real app we would want to get this from an environment variable or config file
    const res = await fetch(`http://localhost:4000/products/${id}`, {
        method: "DELETE",
    });

    if (!res.ok) {
        // We need to handle this error somehow?
    }

    revalidatePath("");
}


// Add new product
export async function addProductAPI(formData: FormData) {

    // Here is all the data from the submitted form
    const title = formData.get("title") as string;
    const price = formData.get("price") as string;
    const description = formData.get("description") as string;
    const thumbnail = formData.get("thumbnail") as string;
    const categoryId = formData.get("categoryId") as string;
    const stock = formData.get("stock") as string;
    const brand = formData.get("brand") as string;

    // This is the object we want to POST to the API
    const newProduct = {
        title,
        brand,
        description,
        thumbnail,
        price: (parseInt(price, 10) < 1) ? 0 : parseInt(price, 10),
        categoryId: (parseInt(categoryId, 10) < 1) ? 1 : parseInt(categoryId, 10),
        stock: (parseInt(stock, 10) > 0) ? parseInt(stock, 10) : 0,
        availabilityStatus: parseInt(stock, 10) > 25 ? "In Stock" : parseInt(stock, 10) < 5 && parseInt(stock, 10) > 0 ? "Low Stock" : "Out of Stock",
    };

    // POST data to API
    const res = await fetch(`http://localhost:4000/products/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProduct),
    });

    const data = await res.json();
    console.log(data);

    // When the user returns to /, the new product should be visible immediately (without needing a hard refresh)
    revalidatePath("/");

    // Redirects the user to / after the product has been created
    redirect("/");
}


// Update existing product
export async function updateProductAPI(formData: FormData) {
  const id = formData.get("id") as string;
  const title = formData.get("title") as string;
  const price = formData.get("price") as string;
  const description = formData.get("description") as string;
  const thumbnail = formData.get("thumbnail") as string;
  const categoryId = formData.get("categoryId") as string;
  const stock = formData.get("stock") as string;
  const brand = formData.get("brand") as string;

  const updatedProduct = {
    title,
    brand,
    description,
    thumbnail,
    price: (parseInt(price, 10) < 1) ? 0 : parseInt(price, 10),
    categoryId: (parseInt(categoryId, 10) < 1) ? 1 : parseInt(categoryId, 10),
    stock: (parseInt(stock, 10) > 0) ? parseInt(stock, 10) : 0,
    availabilityStatus: parseInt(stock, 10) > 25 ? "In Stock" : parseInt(stock, 10) < 5 && parseInt(stock, 10) > 0 ? "Low Stock" : "Out of Stock",
  };

  const res = await fetch(`http://localhost:4000/products/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatedProduct),
  });

  if (!res.ok) {
    throw new Error("Failed to update product");
  }

  revalidatePath("/");
}
"use server";

import { prisma } from "@repo/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { PaginatedProducts } from "@/lib/types/product";

const productInclude = {
  category: true,
  condition: true,
  author: true,
  publisher: true,
} as const;

const VALID_STATUSES = ["In Stock", "Low Stock", "Out of Stock"] as const;

function safeJsonParse(value: string | null, fallback: unknown[] = []): unknown[] {
  if (!value) return fallback;
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function safeJsonParseForPrisma(value: string | null, fallback: any[] = []): any {
  return safeJsonParse(value, fallback);
}

export async function getProducts(
  page = 1,
  pageSize = 6,
  search = "",
  categoryId?: number,
  availabilityStatus?: string,
): Promise<PaginatedProducts> {
  const where: Record<string, unknown> = {};

  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ];
  }

  if (categoryId) {
    where.categoryId = categoryId;
  }

  if (availabilityStatus) {
    where.availabilityStatus = availabilityStatus;
  }

  const [data, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: productInclude,
      orderBy: { id: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.product.count({ where }),
  ]);

  return {
    data,
    total,
    page,
    pageSize,
    totalPages: total > 0 ? Math.ceil(total / pageSize) : 1,
  };
}

export async function getProductStatusCounts() {
  const groups = await prisma.product.groupBy({
    by: ["availabilityStatus"],
    _count: true,
  });

  const counts: Record<string, number> = {};
  let total = 0;
  for (const group of groups) {
    const key = group.availabilityStatus ?? "unknown";
    counts[key.toLowerCase()] = group._count;
    total += group._count;
  }

  return {
    totalProducts: total,
    inStock: counts["in stock"] ?? 0,
    lowStock: counts["low stock"] ?? 0,
    outOfStock: counts["out of stock"] ?? 0,
  };
}

export async function getProductById(id: number) {
  return prisma.product.findUnique({
    where: { id },
    include: productInclude,
  });
}

export async function createProduct(formData: FormData) {
  try {
    const data = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      price: parseInt(formData.get("price") as string, 10) || 0,
      discountPercentage: parseInt(formData.get("discountPercentage") as string, 10) || 0,
      weight: parseInt(formData.get("weight") as string, 10) || 0,
      warrantyInformation: (formData.get("warrantyInformation") as string) || "",
      shippingInformation: (formData.get("shippingInformation") as string) || "",
      availabilityStatus: (formData.get("availabilityStatus") as string) || "In Stock",
      thumbnail: (formData.get("thumbnail") as string) || "",
      images: safeJsonParseForPrisma(formData.get("images") as string),
      tags: safeJsonParseForPrisma(formData.get("tags") as string),
      era: (formData.get("era") as string) || "",
      genre: (formData.get("genre") as string) || "",
      format: (formData.get("format") as string) || "",
      year: new Date((formData.get("year") as string) || new Date()),
      binding: (formData.get("binding") as string) || "",
      categoryId: parseInt(formData.get("categoryId") as string, 10),
      conditionId: parseInt(formData.get("conditionId") as string, 10),
      authorId: parseInt(formData.get("authorId") as string, 10),
      publisherId: parseInt(formData.get("publisherId") as string, 10),
    };

    await prisma.product.create({ data });
  } catch (error) {
    console.error("Failed to create product:", error);
    throw new Error("Failed to create product. Please check your input and try again.");
  }
  revalidatePath("/");
  redirect("/");
}

export async function updateProduct(id: number, formData: FormData) {
  const data: Record<string, unknown> = {};

  const title = formData.get("title");
  if (title !== null && title !== "") data.title = title;

  const description = formData.get("description");
  if (description !== null && description !== "") data.description = description;

  const price = formData.get("price");
  if (price !== null && price !== "") data.price = parseInt(price as string, 10);

  const discountPercentage = formData.get("discountPercentage");
  if (discountPercentage !== null && discountPercentage !== "")
    data.discountPercentage = parseInt(discountPercentage as string, 10);

  const weight = formData.get("weight");
  if (weight !== null && weight !== "") data.weight = parseInt(weight as string, 10);

  const warrantyInformation = formData.get("warrantyInformation");
  if (warrantyInformation !== null) data.warrantyInformation = warrantyInformation;

  const shippingInformation = formData.get("shippingInformation");
  if (shippingInformation !== null) data.shippingInformation = shippingInformation;

  const availabilityStatus = formData.get("availabilityStatus");
  if (availabilityStatus !== null && availabilityStatus !== "")
    data.availabilityStatus = availabilityStatus;

  const thumbnail = formData.get("thumbnail");
  if (thumbnail !== null) data.thumbnail = thumbnail;

  const images = formData.get("images");
  if (images !== null && images !== "") data.images = safeJsonParse(images as string);

  const tags = formData.get("tags");
  if (tags !== null && tags !== "") data.tags = safeJsonParse(tags as string);

  const era = formData.get("era");
  if (era !== null) data.era = era;

  const genre = formData.get("genre");
  if (genre !== null) data.genre = genre;

  const format = formData.get("format");
  if (format !== null) data.format = format;

  const year = formData.get("year");
  if (year !== null && year !== "") data.year = new Date(year as string);

  const binding = formData.get("binding");
  if (binding !== null) data.binding = binding;

  const categoryId = formData.get("categoryId");
  if (categoryId !== null && categoryId !== "")
    data.categoryId = parseInt(categoryId as string, 10);

  const conditionId = formData.get("conditionId");
  if (conditionId !== null && conditionId !== "")
    data.conditionId = parseInt(conditionId as string, 10);

  const authorId = formData.get("authorId");
  if (authorId !== null && authorId !== "")
    data.authorId = parseInt(authorId as string, 10);

  const publisherId = formData.get("publisherId");
  if (publisherId !== null && publisherId !== "")
    data.publisherId = parseInt(publisherId as string, 10);

  try {
    await prisma.product.update({ where: { id }, data });
  } catch (error) {
    console.error("Failed to update product:", error);
    throw new Error("Failed to update product. Please check your input and try again.");
  }
  revalidatePath("/");
  redirect("/");
}

export async function deleteProduct(id: number) {
  try {
    await prisma.product.delete({ where: { id } });
  } catch (error) {
    console.error("Failed to delete product:", error);
    throw new Error("Failed to delete product. It may have associated orders.");
  }
  revalidatePath("/");
}

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
    totalPages: Math.ceil(total / pageSize),
  };
}

export async function getAllProducts() {
  return prisma.product.findMany({
    include: productInclude,
  });
}

export async function getProductById(id: number) {
  return prisma.product.findUnique({
    where: { id },
    include: productInclude,
  });
}

export async function createProduct(formData: FormData) {
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
    images: JSON.parse((formData.get("images") as string) || "[]"),
    tags: JSON.parse((formData.get("tags") as string) || "[]"),
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
  revalidatePath("/");
  redirect("/");
}

export async function updateProduct(id: number, formData: FormData) {
  const data: Record<string, unknown> = {};

  const title = formData.get("title");
  if (title) data.title = title;

  const description = formData.get("description");
  if (description) data.description = description;

  const price = formData.get("price");
  if (price) data.price = parseInt(price as string, 10);

  const discountPercentage = formData.get("discountPercentage");
  if (discountPercentage) data.discountPercentage = parseInt(discountPercentage as string, 10);

  const weight = formData.get("weight");
  if (weight) data.weight = parseInt(weight as string, 10);

  const warrantyInformation = formData.get("warrantyInformation");
  if (warrantyInformation) data.warrantyInformation = warrantyInformation;

  const shippingInformation = formData.get("shippingInformation");
  if (shippingInformation) data.shippingInformation = shippingInformation;

  const availabilityStatus = formData.get("availabilityStatus");
  if (availabilityStatus) data.availabilityStatus = availabilityStatus;

  const thumbnail = formData.get("thumbnail");
  if (thumbnail) data.thumbnail = thumbnail;

  const images = formData.get("images");
  if (images) data.images = JSON.parse(images as string);

  const tags = formData.get("tags");
  if (tags) data.tags = JSON.parse(tags as string);

  const era = formData.get("era");
  if (era) data.era = era;

  const genre = formData.get("genre");
  if (genre) data.genre = genre;

  const format = formData.get("format");
  if (format) data.format = format;

  const year = formData.get("year");
  if (year) data.year = new Date(year as string);

  const binding = formData.get("binding");
  if (binding) data.binding = binding;

  const categoryId = formData.get("categoryId");
  if (categoryId) data.categoryId = parseInt(categoryId as string, 10);

  const conditionId = formData.get("conditionId");
  if (conditionId) data.conditionId = parseInt(conditionId as string, 10);

  const authorId = formData.get("authorId");
  if (authorId) data.authorId = parseInt(authorId as string, 10);

  const publisherId = formData.get("publisherId");
  if (publisherId) data.publisherId = parseInt(publisherId as string, 10);

  await prisma.product.update({ where: { id }, data });
  revalidatePath("/");
}

export async function deleteProduct(id: number) {
  await prisma.product.delete({ where: { id } });
  revalidatePath("/");
}

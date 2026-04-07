"use server";

import { prisma } from "@repo/db";

export async function getCategories() {
  return prisma.category.findMany({ orderBy: { name: "asc" } });
}

export async function getConditions() {
  return prisma.condition.findMany({ orderBy: { grade: "asc" } });
}

export async function getAuthors() {
  return prisma.author.findMany({ orderBy: { name: "asc" } });
}

export async function getPublishers() {
  return prisma.publisher.findMany({ orderBy: { name: "asc" } });
}

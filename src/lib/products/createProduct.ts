"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export type CreateProductInput = {
  name: string;
  sku?: string;
  price: number;
  costPrice?: number;
  reorderPoint?: number;
  stockQuantity?: number;
  rating?: number;
  imageKey?: string;
};

export async function createProduct(input: CreateProductInput) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized - User not logged in.");
  }

  const product = await prisma.product.create({
    data: {
      userId: session.user.id,
      name: input.name,
      sku: input.sku?.trim() || null,
      price: input.price,
      costPrice: input.costPrice ?? 0,
      reorderPoint: input.reorderPoint ?? 0,
      stockQuantity: input.stockQuantity ?? 0,
      rating: input.rating ?? null,
      imageKey: input.imageKey ?? null,
    },
    select: {
      id: true,
      name: true,
      sku: true,
      price: true,
      costPrice: true,
      reorderPoint: true,
      stockQuantity: true,
      rating: true,
      imageKey: true,
    },
  });

  revalidatePath("/inventory");
  revalidatePath("/products");
  revalidatePath("/dashboard");

  return {
    id: product.id,
    name: product.name,
    sku: product.sku,
    price: Number(product.price),
    costPrice: Number(product.costPrice ?? 0),
    reorderPoint: product.reorderPoint ?? 0,
    stockQuantity: product.stockQuantity,
    rating: Number(product.rating ?? 0),
    imageKey: product.imageKey,
  };
}

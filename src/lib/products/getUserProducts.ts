import { prisma } from "@/lib/prisma";

type GetUserProductsParams = {
  search?: string;
};

export async function getUserProducts(
  userId: string,
  { search }: GetUserProductsParams = {},
) {
  const normalizedSearch = search?.trim();
  const products = await prisma.product.findMany({
    where: {
      userId,
      ...(normalizedSearch
        ? {
            OR: [
              {
                name: {
                  contains: normalizedSearch,
                  mode: "insensitive",
                },
              },
              {
                sku: {
                  contains: normalizedSearch,
                  mode: "insensitive",
                },
              },
            ],
          }
        : {}),
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
      createdAt: true,
      updatedAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return products.map((product) => ({
    id: product.id,
    name: product.name,
    sku: product.sku,
    price: Number(product.price),
    costPrice: Number(product.costPrice ?? 0),
    reorderPoint: product.reorderPoint ?? 0,
    stockQuantity: product.stockQuantity,
    rating: Number(product.rating ?? 0),
    imageKey: product.imageKey,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
  }));
}

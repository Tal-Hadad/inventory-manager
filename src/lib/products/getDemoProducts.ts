import { prisma } from "@/lib/prisma";

type GetDemoProductsParams = {
  search?: string;
};

export async function getDemoProducts({ search }: GetDemoProductsParams) {
  const normalizedSearch = search?.trim();

  const products = await prisma.demoProduct.findMany({
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

    where: normalizedSearch
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
      : undefined,
    orderBy: {
      name: "asc",
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
  }));
}

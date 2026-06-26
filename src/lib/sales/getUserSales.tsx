"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth"; // ADDED
import {
  toNumber,
  type DecimalLike,
} from "@/lib/dashboard/buildDashboardOverview";

export type GetUserSalesParams = {
  search?: string;
  startDate?: Date;
  endDate?: Date;
};

export type UserSalesRow = {
  id: string;
  soldAt: Date;
  productId: string;
  productName: string;
  sku: string | null;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
};

export async function getUserSales(
  params: GetUserSalesParams = {},
): Promise<UserSalesRow[]> {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const { search, startDate, endDate } = params;
  const normalizedSearch = search?.trim() || undefined;

  const sales = await prisma.sale.findMany({
    where: {
      userId: session.user.id,
      ...(startDate && endDate
        ? {
            soldAt: {
              gte: startDate,
              lt: endDate,
            },
          }
        : {}),
      ...(normalizedSearch
        ? {
            product: {
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
            },
          }
        : {}),
    },
    include: {
      product: {
        select: {
          id: true,
          name: true,
          sku: true,
        },
      },
    },
    orderBy: {
      soldAt: "desc",
    },
  });

  return sales.map((sale) => ({
    id: sale.id,
    soldAt: sale.soldAt,
    productId: sale.productId,
    productName: sale.product?.name ?? "Unknown",
    sku: sale.product?.sku ?? null,
    quantity: sale.quantity,
    unitPrice: toNumber(sale.unitPrice as unknown as DecimalLike),
    totalAmount: toNumber(sale.totalAmount as unknown as DecimalLike),
  }));
}

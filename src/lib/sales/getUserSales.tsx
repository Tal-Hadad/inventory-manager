"use server";

import { prisma } from "@/lib/prisma";
import {
  toNumber,
  type DecimalLike,
} from "@/lib/dashboard/buildDashboardOverview";

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

type GetUserSalesParams = {
  startDate?: Date;
  endDate?: Date;
};

export async function getUserSales(
  userId: string,
  { startDate, endDate }: GetUserSalesParams = {},
) {
  const sales = await prisma.sale.findMany({
    where: {
      userId,
      ...(startDate || endDate
        ? {
            soldAt: {
              ...(startDate ? { gte: startDate } : {}),
              ...(endDate ? { lt: endDate } : {}),
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

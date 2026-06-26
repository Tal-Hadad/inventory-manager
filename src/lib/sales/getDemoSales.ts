"use server";

import { prisma } from "@/lib/prisma";
import {
  toNumber,
  type DecimalLike,
} from "@/lib/dashboard/buildDashboardOverview";

export type GetDemoSalesParams = {
  startDate?: Date;
  endDate?: Date;
};

export type DemoSalesRow = {
  id: string;
  soldAt: Date;
  productId: string;
  productName: string;
  sku: string | null;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
};

export async function getDemoSales(
  params: GetDemoSalesParams = {},
): Promise<DemoSalesRow[]> {
  const { startDate, endDate } = params;

  const sales = await prisma.demoSale.findMany({
    where: {
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

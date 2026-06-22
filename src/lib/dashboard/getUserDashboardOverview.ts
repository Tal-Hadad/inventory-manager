import type { DashboardOverview, DashboardPeriod } from "./dashboardTypes";
import { prisma } from "@/lib/prisma";
import { buildDashboardOverview } from "./buildDashboardOverview";
import { getPeriodRanges } from "./getPeriodRanges";

function getPurchaseChartStart(): Date {
  const now = new Date();

  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 5, 1));
}

export async function getUserDashboardOverview(
  userId: string,
  period: DashboardPeriod = "last30Days",
): Promise<DashboardOverview> {
  const { currentStart, currentEnd, previousStart, previousEnd } =
    getPeriodRanges(period);

  const purchaseChartStart = getPurchaseChartStart();

  const [
    salesAgg,
    purchaseAgg,
    expenseAgg,
    groupedExpenses,
    groupedSales,
    previousSalesAgg,
    previousPurchaseAgg,
    salesRows,
    purchaseRows,
  ] = await Promise.all([
    prisma.sale.aggregate({
      where: {
        userId,
        soldAt: {
          gte: currentStart,
          lt: currentEnd,
        },
      },
      _sum: { totalAmount: true, quantity: true },
      _count: { id: true },
    }),
    prisma.purchase.aggregate({
      where: {
        userId,
        purchasedAt: {
          gte: currentStart,
          lt: currentEnd,
        },
      },
      _sum: { totalCost: true, quantity: true },
      _count: { id: true },
    }),
    prisma.expense.aggregate({
      where: {
        userId,
        spentAt: {
          gte: currentStart,
          lt: currentEnd,
        },
      },
      _sum: { amount: true },
      _count: { id: true },
    }),
    prisma.expense.groupBy({
      by: ["categoryId"],
      where: {
        userId,
        spentAt: {
          gte: currentStart,
          lt: currentEnd,
        },
      },
      _sum: { amount: true },
      orderBy: {
        _sum: { amount: "desc" },
      },
      take: 5,
    }),
    prisma.sale.groupBy({
      by: ["productId"],
      where: {
        userId,
        soldAt: {
          gte: currentStart,
          lt: currentEnd,
        },
      },
      _sum: { quantity: true, totalAmount: true },
      orderBy: {
        _sum: { quantity: "desc" },
      },
      take: 15,
    }),
    prisma.sale.aggregate({
      where: {
        userId,
        soldAt: {
          gte: previousStart,
          lt: previousEnd,
        },
      },
      _sum: { totalAmount: true },
    }),
    prisma.purchase.aggregate({
      where: {
        userId,
        purchasedAt: {
          gte: previousStart,
          lt: previousEnd,
        },
      },
      _sum: { totalCost: true },
    }),
    prisma.sale.findMany({
      where: {
        userId,
        soldAt: {
          gte: currentStart,
          lt: currentEnd,
        },
      },
      select: {
        soldAt: true,
        totalAmount: true,
      },
      orderBy: {
        soldAt: "asc",
      },
    }),
    prisma.purchase.findMany({
      where: {
        userId,
        purchasedAt: {
          gte: purchaseChartStart,
        },
      },
      select: {
        purchasedAt: true,
        totalCost: true,
      },
      orderBy: {
        purchasedAt: "asc",
      },
    }),
  ]);

  const categoryIds = groupedExpenses
    .map((item) => item.categoryId)
    .filter((id): id is string => Boolean(id));

  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      where: {
        userId,
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
      },
    }),

    categoryIds.length
      ? prisma.expenseCategory.findMany({
          where: {
            userId,
            id: { in: categoryIds },
          },
          select: {
            id: true,
            name: true,
          },
        })
      : [],
  ]);

  const categoryMap = new Map(
    categories.map((category) => [category.id, category.name]),
  );

  return buildDashboardOverview({
    isDemo: false,
    period,
    currentStart,
    salesAgg,
    purchaseAgg,
    expenseAgg,
    previousSalesAgg,
    previousPurchaseAgg,
    salesRows,
    purchaseRows,
    groupedSales,
    groupedExpenses,
    products,
    getExpenseCategoryName: (item) =>
      categoryMap.get(item.categoryId ?? "") ?? "Uncategorized",
  });
}

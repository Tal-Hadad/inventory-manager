import type { DashboardOverview, DashboardPeriod } from "./dashboardTypes";
import { prisma } from "@/lib/prisma";
import { buildDashboardOverview } from "./buildDashboardOverview";
import { getPeriodRanges } from "./getPeriodRanges";

function getPurchaseChartStart(): Date {
  const now = new Date();

  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 5, 1));
}

export async function getDemoDashboardOverview(
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
    prisma.demoSale.aggregate({
      where: {
        soldAt: {
          gte: currentStart,
          lt: currentEnd,
        },
      },
      _sum: { totalAmount: true, quantity: true },
      _count: { id: true },
    }),
    prisma.demoPurchase.aggregate({
      where: {
        purchasedAt: {
          gte: currentStart,
          lt: currentEnd,
        },
      },
      _sum: { totalCost: true, quantity: true },
      _count: { id: true },
    }),
    prisma.demoExpense.aggregate({
      where: {
        spentAt: {
          gte: currentStart,
          lt: currentEnd,
        },
      },
      _sum: { amount: true },
      _count: { id: true },
    }),
    prisma.demoExpense.groupBy({
      by: ["category"],
      where: {
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
    prisma.demoSale.groupBy({
      by: ["productId"],
      where: {
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
    prisma.demoSale.aggregate({
      where: {
        soldAt: {
          gte: previousStart,
          lt: previousEnd,
        },
      },
      _sum: { totalAmount: true },
    }),
    prisma.demoPurchase.aggregate({
      where: {
        purchasedAt: {
          gte: previousStart,
          lt: previousEnd,
        },
      },
      _sum: { totalCost: true },
    }),
    prisma.demoSale.findMany({
      where: {
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
    prisma.demoPurchase.findMany({
      where: {
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
  });

  return buildDashboardOverview({
    isDemo: true,
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
    getExpenseCategoryName: (item) => item.category ?? "Uncategorized",
  });
}

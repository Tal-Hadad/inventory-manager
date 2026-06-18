import type { DashboardOverview, DashboardPeriod } from "./dashboardTypes";
import { prisma } from "@/lib/prisma";
import { getPeriodRanges } from "./getPeriodRanges";
import { buildSalesChart } from "./buildSalesChart";

export async function getUserDashboardOverview(
  userId: string,
  period: DashboardPeriod = "last30Days",
): Promise<DashboardOverview> {
  const { currentStart, currentEnd, previousStart, previousEnd } =
    getPeriodRanges(period);

  const [
    salesAgg,
    purchaseAgg,
    expenseAgg,
    groupedExpenses,
    groupedSales,
    previousSalesAgg,
    salesRows,
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
  ]);

  const currentRevenue = Number(salesAgg._sum.totalAmount ?? 0);
  const previousRevenue = Number(previousSalesAgg._sum.totalAmount ?? 0);

  const changePercentage =
    previousRevenue === 0
      ? 0
      : ((currentRevenue - previousRevenue) / previousRevenue) * 100;

  const salesChart = buildSalesChart(salesRows, period, currentStart);

  const categoryIds = groupedExpenses
    .map((item) => item.categoryId)
    .filter((id): id is string => Boolean(id));

  const productIds = groupedSales.map((item) => item.productId);

  const [categories, products] = await Promise.all([
    categoryIds.length
      ? prisma.expenseCategory.findMany({
          where: { userId, id: { in: categoryIds } },
          select: { id: true, name: true },
        })
      : [],
    productIds.length
      ? prisma.product.findMany({
          where: { userId, id: { in: productIds } },
          select: {
            id: true,
            name: true,
            sku: true,
            price: true,
            rating: true,
          },
        })
      : [],
  ]);

  return {
    isDemo: false,
    salesChart,
    popularProducts: groupedSales.map((item) => {
      const product = products.find((p) => p.id === item.productId);

      return {
        productId: item.productId,
        name: product?.name ?? "Unknown",
        sku: product?.sku ?? null,
        quantitySold: Number(item._sum.quantity ?? 0),
        revenue: Number(item._sum.totalAmount ?? 0),
        price: Number(product?.price ?? 0),
        rating: Number(product?.rating ?? 0),
      };
    }),
    salesSummary: {
      totalRevenue: Number(salesAgg._sum.totalAmount ?? 0),
      totalSalesCount: salesAgg._count.id,
      totalUnitsSold: Number(salesAgg._sum.quantity ?? 0),
      changePercentage: Number(changePercentage.toFixed(1)),
    },
    purchaseSummary: {
      totalPurchaseCost: Number(purchaseAgg._sum.totalCost ?? 0),
      totalPurchaseCount: purchaseAgg._count.id,
      totalPurchasedUnits: Number(purchaseAgg._sum.quantity ?? 0),
    },
    expenseSummary: {
      totalExpenses: Number(expenseAgg._sum.amount ?? 0),
      totalExpenseCount: expenseAgg._count.id,
      topCategories: groupedExpenses.map((item) => ({
        category:
          categories.find((category) => category.id === item.categoryId)
            ?.name ?? "Uncategorized",
        amount: Number(item._sum.amount ?? 0),
      })),
    },
  };
}

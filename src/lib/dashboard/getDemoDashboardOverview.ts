import type { DashboardOverview } from "./dashboardTypes";
import { prisma } from "@/lib/prisma";

export async function getDemoDashboardOverview(): Promise<DashboardOverview> {
  const [salesAgg, purchaseAgg, expenseAgg, groupedExpenses, groupedSales] =
    await Promise.all([
      prisma.demoSale.aggregate({
        _sum: { totalAmount: true, quantity: true },
        _count: { id: true },
      }),
      prisma.demoPurchase.aggregate({
        _sum: { totalCost: true, quantity: true },
        _count: { id: true },
      }),
      prisma.demoExpense.aggregate({
        _sum: { amount: true },
        _count: { id: true },
      }),
      prisma.demoExpense.groupBy({
        by: ["category"],
        _sum: { amount: true },
        orderBy: {
          _sum: { amount: "desc" },
        },
        take: 5,
      }),
      prisma.demoSale.groupBy({
        by: ["productId"],
        _sum: { quantity: true, totalAmount: true },
        orderBy: {
          _sum: { quantity: "desc" },
        },
        take: 15,
      }),
    ]);

  const productIds = groupedSales.map((item) => item.productId);

  const products = productIds.length
    ? await prisma.demoProduct.findMany({
        where: { id: { in: productIds } },
        select: { id: true, name: true, sku: true, price: true, rating: true },
      })
    : [];

  return {
    isDemo: true,
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
        category: item.category,
        amount: Number(item._sum.amount ?? 0),
      })),
    },
  };
}

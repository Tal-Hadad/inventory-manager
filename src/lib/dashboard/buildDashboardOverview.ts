import type { DashboardOverview, DashboardPeriod } from "./dashboardTypes";
import { buildPurchaseChart } from "./buildPurchaseChart";
import { buildSalesChart } from "./buildSalesChart";

type DecimalLike = {
  toNumber(): number;
};

type SalesRow = {
  soldAt: Date;
  totalAmount: number | DecimalLike;
};

type PurchaseRow = {
  purchasedAt: Date;
  totalCost: number | DecimalLike;
};

type ProductLike = {
  id: string;
  name: string;
  sku: string | null;
  price: number | DecimalLike | null;
  rating: number | DecimalLike | null;
};

type GroupedSalesRow = {
  productId: string;
  _sum: {
    quantity: number | DecimalLike | null;
    totalAmount: number | DecimalLike | null;
  };
};

type BaseGroupedExpense = {
  _sum: {
    amount: number | DecimalLike | null;
  };
};

type BuildDashboardOverviewParams<TGroupedExpense extends BaseGroupedExpense> =
  {
    isDemo: boolean;
    period: DashboardPeriod;
    currentStart: Date;
    salesAgg: {
      _sum: {
        totalAmount: number | DecimalLike | null;
        quantity: number | DecimalLike | null;
      };
      _count: {
        id: number;
      };
    };
    purchaseAgg: {
      _sum: {
        totalCost: number | DecimalLike | null;
        quantity: number | DecimalLike | null;
      };
      _count: {
        id: number;
      };
    };
    expenseAgg: {
      _sum: {
        amount: number | DecimalLike | null;
      };
      _count: {
        id: number;
      };
    };
    previousSalesAgg: {
      _sum: {
        totalAmount: number | DecimalLike | null;
      };
    };
    previousPurchaseAgg: {
      _sum: {
        totalCost: number | DecimalLike | null;
      };
    };
    salesRows: SalesRow[];
    purchaseRows: PurchaseRow[];
    groupedSales: GroupedSalesRow[];
    groupedExpenses: TGroupedExpense[];
    products: ProductLike[];
    getExpenseCategoryName: (item: TGroupedExpense) => string;
  };

function toNumber(value: number | DecimalLike | null | undefined): number {
  if (value == null) {
    return 0;
  }

  if (typeof value === "number") {
    return value;
  }

  return value.toNumber();
}

export function buildDashboardOverview<
  TGroupedExpense extends BaseGroupedExpense,
>({
  isDemo,
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
  getExpenseCategoryName,
}: BuildDashboardOverviewParams<TGroupedExpense>): DashboardOverview {
  const currentRevenue = toNumber(salesAgg._sum.totalAmount);
  const previousRevenue = toNumber(previousSalesAgg._sum.totalAmount);

  const salesChangePercentage =
    previousRevenue === 0
      ? 0
      : ((currentRevenue - previousRevenue) / previousRevenue) * 100;

  const currentPurchaseCost = toNumber(purchaseAgg._sum.totalCost);
  const previousPurchaseCost = toNumber(previousPurchaseAgg._sum.totalCost);

  const purchaseChangePercentage =
    previousPurchaseCost === 0
      ? 0
      : ((currentPurchaseCost - previousPurchaseCost) / previousPurchaseCost) *
        100;

  const salesChart = buildSalesChart(
    salesRows.map((row) => ({
      soldAt: row.soldAt,
      totalAmount: toNumber(row.totalAmount),
    })),
    period,
    currentStart,
  );

  const purchaseChart = buildPurchaseChart(
    purchaseRows.map((row) => ({
      purchasedAt: row.purchasedAt,
      totalCost: toNumber(row.totalCost),
    })),
  );

  const productMap = new Map(products.map((product) => [product.id, product]));

  return {
    isDemo,
    salesChart,
    purchaseChart,
    popularProducts: groupedSales.map((item) => {
      const product = productMap.get(item.productId);

      return {
        productId: item.productId,
        name: product?.name ?? "Unknown",
        sku: product?.sku ?? null,
        quantitySold: toNumber(item._sum.quantity),
        revenue: toNumber(item._sum.totalAmount),
        price: toNumber(product?.price ?? null),
        rating: toNumber(product?.rating ?? null),
      };
    }),
    salesSummary: {
      totalRevenue: currentRevenue,
      totalSalesCount: salesAgg._count.id,
      totalUnitsSold: toNumber(salesAgg._sum.quantity),
      changePercentage: Number(salesChangePercentage.toFixed(1)),
    },
    purchaseSummary: {
      totalPurchaseCost: currentPurchaseCost,
      totalPurchaseCount: purchaseAgg._count.id,
      totalPurchasedUnits: toNumber(purchaseAgg._sum.quantity),
      changePercentage: Number(purchaseChangePercentage.toFixed(1)),
    },
    expenseSummary: {
      totalExpenses: toNumber(expenseAgg._sum.amount),
      totalExpenseCount: expenseAgg._count.id,
      topCategories: groupedExpenses.map((item) => ({
        category: getExpenseCategoryName(item),
        amount: toNumber(item._sum.amount),
      })),
    },
  };
}

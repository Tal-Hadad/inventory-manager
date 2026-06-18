export type DashboardPeriod =
  | "last7Days"
  | "last30Days"
  | "last90Days"
  | "last12Months";
export type DashboardOverview = {
  isDemo: boolean;
  popularProducts: Array<{
    productId: string;
    name: string;
    sku: string | null;
    quantitySold: number;
    revenue: number;
    price: number;
    rating: number;
  }>;
  salesSummary: {
    totalRevenue: number;
    totalSalesCount: number;
    totalUnitsSold: number;
    changePercentage: number;
  };
  salesChart: Array<{
    date: string;
    totalValue: number;
  }>;
  purchaseSummary: {
    totalPurchaseCost: number;
    totalPurchaseCount: number;
    totalPurchasedUnits: number;
  };
  expenseSummary: {
    totalExpenses: number;
    totalExpenseCount: number;
    topCategories: Array<{
      category: string;
      amount: number;
    }>;
  };
};

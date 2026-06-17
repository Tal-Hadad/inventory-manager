export type DashboardOverview = {
  popularProducts: Array<{
    productId: string;
    name: string;
    sku: string | null;
    quantitySold: number;
    revenue: number;
    price: number;
    rating?: number;
  }>;
  salesSummary: {
    totalRevenue: number;
    totalSalesCount: number;
    totalUnitsSold: number;
  };
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
  isDemo: boolean;
};

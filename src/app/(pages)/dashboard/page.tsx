import { auth } from "@/auth";
import PopularProductsCard from "@/app/(pages)/dashboard/PopularProductsCard";
import SalesSummaryCard from "@/app/(pages)/dashboard/SalesSummaryCard";
import { getDemoDashboardOverview } from "@/lib/dashboard/getDemoDashboardOverview";
import { getUserDashboardOverview } from "@/lib/dashboard/getUserDashboardOverview";
import PurchaseSummaryCard from "./PurchaseSummaryCard";
import ExpenseSummaryCard from "./ExpenseSummaryCard";
import LowStockProductsCard from "./LowStockProductsCard";
import EstimatedProfitCard from "./EstimatedProfitCard";
import PageHeader from "@/components/PageHeader";

export default async function DashboardPage() {
  const session = await auth();

  const data = session?.user?.id
    ? await getUserDashboardOverview(session.user.id, "last30Days")
    : await getDemoDashboardOverview("last30Days");

  const errorMessage = "Failed to load dashboard data";
  if (!data) {
    throw new Error(errorMessage);
  }
  return (
    <div>
      <PageHeader name="Dashboard" isDemo={data.isDemo} showTitle={false} />

      <section
        className="grid md:grid-rows-[repeat(8,20vh)] 
      xl:grid-rows-[repeat(8,7.5vh)] grid-cols-1 gap-10 pb-4 md:grid-cols-2 xl:grid-cols-3 xl:overflow-auto scrollbar-thumb-accent mr-3"
      >
        <PopularProductsCard products={data.popularProducts} />
        <LowStockProductsCard lowStockSummary={data.lowStockSummary} />

        <SalesSummaryCard
          initialSalesSummary={data.salesSummary}
          initialSalesChart={data.salesChart}
        />
        <EstimatedProfitCard
          estimatedProfitSummary={data.estimatedProfitSummary}
        />
        <ExpenseSummaryCard expenseSummary={data.expenseSummary} />
        <PurchaseSummaryCard
          purchaseSummary={data.purchaseSummary}
          purchaseChart={data.purchaseChart}
        />
      </section>
    </div>
  );
}

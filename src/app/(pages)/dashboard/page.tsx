import { auth } from "@/auth";
import PopularProductsCard from "@/app/(pages)/dashboard/PopularProductsCard";
import SalesSummeryCard from "@/app/(pages)/dashboard/SalesSummaryCard";
import { getDemoDashboardOverview } from "@/lib/dashboard/getDemoDashboardOverview";
import { getUserDashboardOverview } from "@/lib/dashboard/getUserDashboardOverview";
import PurchaseSummaryCard from "./PurchaseSummaryCard";
import ExpenseSummaryCard from "./ExpenseSummaryCard";
import LowStockProductsCard from "./LowStockProductsCard";
import EstimatedProfitCard from "./EstimatedProfitCard";

export default async function DashboardPage() {
  const session = await auth();

  const data = session?.user?.id
    ? await getUserDashboardOverview(session.user.id, "last30Days")
    : await getDemoDashboardOverview("last30Days");

  return (
    <div className="space-y-6 pr-5">
      {data.isDemo ? (
        <div className="rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 px-4 py-3 text-sm text-zinc-600 dark:border-zinc-700 dark:bg-zinc-900/50 dark:text-zinc-300">
          You are viewing demo data. Sign in to view your own dashboard.
        </div>
      ) : null}

      <section
        className="grid md:grid-rows-[repeat(8,20vh)] 
      xl:grid-rows-[repeat(8,7.5vh)] grid-cols-1 gap-10 pb-4 md:grid-cols-2 xl:grid-cols-3 xl:overflow-auto scrollbar-thumb-accent"
      >
        <PopularProductsCard products={data.popularProducts} />
        <LowStockProductsCard lowStockSummary={data.lowStockSummary} />

        <SalesSummeryCard
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

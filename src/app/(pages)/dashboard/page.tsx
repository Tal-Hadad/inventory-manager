import { auth } from "@/auth";
import PopularProductsCard from "@/app/(pages)/dashboard/PopularProductsCard";
import SalesSummeryCard from "@/app/(pages)/dashboard/SalesSummaryCard";
import { getDemoDashboardOverview } from "@/lib/dashboard/getDemoDashboardOverview";
import { getUserDashboardOverview } from "@/lib/dashboard/getUserDashboardOverview";
import PurchaseSummaryCard from "./PurchaseSummaryCard";

export default async function DashboardPage() {
  const session = await auth();

  const data = session?.user?.id
    ? await getUserDashboardOverview(session.user.id, "last30Days")
    : await getDemoDashboardOverview("last30Days");

  return (
    <div className="space-y-6">
      {data.isDemo ? (
        <div className="rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 px-4 py-3 text-sm text-zinc-600 dark:border-zinc-700 dark:bg-zinc-900/50 dark:text-zinc-300">
          You are viewing demo data. Sign in to view your own dashboard.
        </div>
      ) : null}

      <section className="custom-grid-rows grid grid-cols-1 gap-10 pb-4 md:grid-cols-2 xl:grid-cols-3 xl:overflow-auto">
        <PopularProductsCard products={data.popularProducts} />

        <SalesSummeryCard
          initialSalesSummary={data.salesSummary}
          initialSalesChart={data.salesChart}
        />

        <PurchaseSummaryCard
          purchaseSummary={data.purchaseSummary}
          purchaseChart={data.purchaseChart}
        />
        <div className="row-span-2 col-span-1 bg-gray-500 md:col-span-2 xl:row-span-3 xl:col-span-1" />
        <div className="row-span-3 bg-gray-500" />
        <div className="bg-gray-500 md:row-span-1 xl:row-span-2" />
        <div className="bg-gray-500 md:row-span-1 xl:row-span-2" />
        <div className="bg-gray-500 md:row-span-1 xl:row-span-2" />
      </section>
    </div>
  );
}

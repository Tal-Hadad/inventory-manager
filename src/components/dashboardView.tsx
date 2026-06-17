import type { DashboardOverview } from "@//lib/dashboard/dashboardTypes";
import CardPopularProducts from "@/app/(pages)/dashboard/PopularProductsCard";
import { auth } from "@/auth";

interface DashboardViewProps {
  data: DashboardOverview;
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export async function DashboardView({ data }: DashboardViewProps) {
  const session = await auth();

  return (
    <div className="space-y-6">
      {data.isDemo ? (
        <div className="rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 px-4 py-3 text-sm text-zinc-600 dark:border-zinc-700 dark:bg-zinc-900/50 dark:text-zinc-300">
          You are viewing demo data. Sign in to view your own dashboard.{" "}
        </div>
      ) : null}

      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 xl:overflow-auto gap-10 pb-4 custom-grid-rows">
        <CardPopularProducts products={data.popularProducts} />

        <div className="row-span-3 xl:row-span-6 bg-gray-500"></div>
        <div className="row-span-2 xl:row-span-3 col-span-1 md:col-span-2 xl:col-span-1 bg-gray-500"></div>
        <div className="row-span-3 bg-gray-500"></div>
        <div className="md:row-span-1 xl:row-span-2 bg-gray-500"></div>
        <div className="md:row-span-1 xl:row-span-2 bg-gray-500"></div>
        <div className="md:row-span-1 xl:row-span-2 bg-gray-500"></div>
      </section>
    </div>
  );
}

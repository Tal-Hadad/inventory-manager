import type { DashboardOverview } from "@/lib/dashboard/dashboardTypes";
import { TrendingUp, DollarSign } from "lucide-react";

interface EstimatedProfitCardProps {
  estimatedProfitSummary: DashboardOverview["estimatedProfitSummary"];
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value);
}

export default function EstimatedProfitCard({
  estimatedProfitSummary,
}: EstimatedProfitCardProps) {
  const { totalEstimatedProfit, totalEstimatedProfitMargin } =
    estimatedProfitSummary;

  const isPositive = totalEstimatedProfit >= 0;

  return (
    <div className="row-span-1 xl:row-span-2 rounded-2xl bg-white px-7 shadow-md dark:bg-zinc-900 border ">
      <p className="text-lg font-semibold pt-5 pb-2">Estimated Profit</p>
      <hr />
      <div className="flex items-start justify-between">
        <div>
          <h3 className="mt-3 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            {formatCurrency(totalEstimatedProfit)}
          </h3>
        </div>

        <div className="rounded-full bg-emerald-500/10 p-3 text-emerald-500 dark:bg-emerald-400/10 dark:text-emerald-300 mt-3">
          <DollarSign className="h-5 w-5" />
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between mb-3">
        <div
          className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium ${
            isPositive
              ? "bg-emerald-500/10 text-emerald-500 dark:bg-emerald-400/10 dark:text-emerald-300"
              : "bg-red-500/10 text-red-500 dark:bg-red-400/10 dark:text-red-300"
          }`}
        >
          <TrendingUp className="h-4 w-4" />
          {totalEstimatedProfitMargin.toFixed(1)}%
        </div>

        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Estimated margin
        </p>
      </div>
    </div>
  );
}

"use client";
import type { DashboardOverview } from "@/lib/dashboard/dashboardTypes";
import { TrendingDown, TrendingUp } from "lucide-react";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface PurchaseSummaryCardProps {
  purchaseSummary: DashboardOverview["purchaseSummary"];
  purchaseChart: DashboardOverview["purchaseChart"];
}

export default function PurchaseSummaryCard({
  purchaseSummary,
  purchaseChart,
}: PurchaseSummaryCardProps) {
  return (
    <>
      <div className="row-span-2 xl:row-span-3 col-span-1 md:col-span-2 rounded-2xl xl:col-span-1 pb-16 shadow-md bg-white dark:bg-zinc-900">
        <h3 className="px-7 pt-5 pb-2 text-lg font-semibold">
          Purchase Summary
        </h3>
        <hr />
        <div className="mb-4 mt-7 px-7">
          <p className="text-xs text-gray-400">Purchased</p>
          <div className="flex items-center gap-2">
            <p className="text-xl font-semibold">
              ${Number(purchaseSummary.totalPurchaseCost)}
            </p>
            <div>
              <p
                className={`text-sm ${
                  purchaseSummary.changePercentage! >= 0
                    ? "text-green-500"
                    : "text-red-500"
                } flex ml-3`}
              >
                {purchaseSummary.changePercentage! >= 0 ? (
                  <TrendingUp className="w-4 h-4 mr-1 " />
                ) : (
                  <TrendingDown className="w-4 h-4 mr-1" />
                )}
                {purchaseSummary.changePercentage}%
              </p>
            </div>
          </div>
          <section>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart
                data={purchaseChart}
                margin={{ top: 0, right: 8, left: -50, bottom: 55 }}
              >
                <XAxis dataKey="date" tick={false} axisLine={false} />
                <YAxis tick={false} axisLine={false} tickLine={false} />

                <Tooltip
                  cursor={{ fill: "rgba(161,161,170,0.08)" }}
                  formatter={(value) => [
                    `$${Number(value ?? 0).toLocaleString("en")}`,
                    "Purchases",
                  ]}
                  labelFormatter={(label) => {
                    const date = new Date(label);
                    return date.toLocaleDateString("en", {
                      month: "short",
                      day: "numeric",
                    });
                  }}
                  contentStyle={{
                    borderRadius: "12px",
                    border: "1px solid rgba(161,161,170,0.2)",
                    backgroundColor: "#18181b",
                    color: "#fff",
                  }}
                  labelStyle={{ color: "#d4d4d8" }}
                />
                <Area
                  type="natural"
                  dataKey="totalPurchased"
                  stroke="#8884d8"
                  fill="#8884d8"
                  dot={true}
                />
              </AreaChart>
            </ResponsiveContainer>
          </section>
        </div>
      </div>
    </>
  );
}

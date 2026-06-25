"use client";

import { useEffect, useMemo, useState } from "react";
import type {
  DashboardOverview,
  DashboardPeriod,
} from "@/lib/dashboard/dashboardTypes";
import { TrendingDown, TrendingUp } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface SalesSummaryCardProps {
  initialSalesSummary: DashboardOverview["salesSummary"];
  initialSalesChart: DashboardOverview["salesChart"];
}

export default function SalesSummeryCard({
  initialSalesSummary,
  initialSalesChart,
}: SalesSummaryCardProps) {
  const periodOptions: DashboardPeriod[] = [
    "last7Days",
    "last30Days",
    "last90Days",
    "last12Months",
  ];

  const periodLabels: Record<DashboardPeriod, string> = {
    last7Days: "Last 7 Days",
    last30Days: "Last 30 Days",
    last90Days: "Last 90 Days",
    last12Months: "Last 12 Months",
  };
  const [period, setPeriod] = useState<DashboardPeriod>("last30Days");
  const [salesSummary, setSalesSummary] = useState(initialSalesSummary);
  const [salesChart, setSalesChart] = useState(initialSalesChart);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let ignore = false;

    async function loadSalesSummary() {
      setIsLoading(true);

      try {
        const response = await fetch(
          `/api/dashboard/sales-summary?period=${period}`,
          {
            cache: "no-store",
          },
        );

        const text = await response.text();

        if (!response.ok) {
          throw new Error(text || "Failed to fetch sales summary");
        }

        const data = JSON.parse(text);

        if (!ignore) {
          setSalesSummary(data.salesSummary);
          setSalesChart(data.salesChart);
        }
      } catch (error) {
        console.error("Failed to load sales summary:", error);
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }

    loadSalesSummary();

    return () => {
      ignore = true;
    };
  }, [period]);

  const isPositive = salesSummary.changePercentage >= 0;

  const highestSalesDay = useMemo(() => {
    if (salesChart.length === 0) return null;

    return salesChart.reduce((highest, current) =>
      current.totalValue > highest.totalValue ? current : highest,
    );
  }, [salesChart]);

  const highestSalesDateLabel = highestSalesDay
    ? new Date(highestSalesDay.date).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "N/A";

  const highestSalesAmount = highestSalesDay
    ? `$${highestSalesDay.totalValue.toLocaleString("en-US")}`
    : "$0";

  return (
    <div className="row-span-3 rounded-2xl pb-16 shadow-md dark:bg-zinc-900 xl:row-span-6">
      <h3 className="px-7 pt-5 pb-2 text-lg font-semibold">Sales Summary</h3>
      <hr />

      <section className=" flex items-center justify-between px-7 mb-6 mt-4">
        <div className="text-lg font-medium">
          <p className="text-xs text-gray-400">Value</p>

          <div className="flex items-center text-2xl font-extrabold">
            $
            {salesSummary.totalRevenue.toLocaleString("en", {
              maximumFractionDigits: 0,
            })}
            <div
              className={`ml-2 flex items-center text-sm font-medium ${
                isPositive ? "text-green-500" : "text-red-500"
              }`}
            >
              {isPositive ? (
                <TrendingUp className="mr-1 h-4 w-4" />
              ) : (
                <TrendingDown className="mr-1 h-4 w-4" />
              )}

              <span>
                {isPositive ? "+" : ""}
                {salesSummary.changePercentage}%
              </span>
            </div>
          </div>
        </div>

        <select
          className="rounded border border-gray-300 bg-white p-2 shadow-sm dark:border-zinc-700 dark:bg-zinc-900"
          value={period}
          onChange={(event) => setPeriod(event.target.value as DashboardPeriod)}
        >
          {periodOptions.map((option) => (
            <option key={option} value={option}>
              {periodLabels[option]}
            </option>
          ))}
        </select>
      </section>

      <section className={isLoading ? "opacity-60 transition-opacity" : ""}>
        <ResponsiveContainer width="100%" height={440}>
          <BarChart
            key={period}
            data={salesChart}
            margin={{ top: 0, right: 8, left: -25, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />

            <XAxis
              dataKey="date"
              type="category"
              allowDuplicatedCategory={false}
              interval="preserveStartEnd"
              minTickGap={24}
              tickMargin={10}
              tickFormatter={(value) => {
                const date = new Date(value);

                if (period === "last12Months") {
                  return date.toLocaleDateString("en-GB", {
                    month: "short",
                  });
                }

                return date.toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "2-digit",
                });
              }}
              tick={{ fontSize: 12, fill: "#71717a" }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              tickFormatter={(value) =>
                `$${(Number(value) / 1000).toFixed(0)}k`
              }
              tick={{ fontSize: 12, fill: "#71717a" }}
              tickLine={false}
              axisLine={false}
            />

            <Tooltip
              cursor={{ fill: "rgba(161,161,170,0.08)" }}
              formatter={(value) => [
                `$${Number(value ?? 0).toLocaleString("en")}`,
                "Revenue",
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

            <Bar
              dataKey="totalValue"
              fill="#2B7FFF"
              barSize={18}
              radius={[10, 10, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>

        <div>
          <hr />
          <div className="text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400 mr-5">
              Highest Sale Date:{" "}
              <span className="font-semibold text-zinc-900 dark:text-white">
                {highestSalesAmount} on {highestSalesDateLabel}
              </span>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

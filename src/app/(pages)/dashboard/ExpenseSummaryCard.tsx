"use client";

import type { DashboardOverview } from "@/lib/dashboard/dashboardTypes";
import { Pie, PieChart, ResponsiveContainer, Sector } from "recharts";

interface ExpenseSummaryCardProps {
  expenseSummary: DashboardOverview["expenseSummary"];
}

export default function ExpenseSummaryCard({
  expenseSummary,
}: ExpenseSummaryCardProps) {
  const colors = ["#00C49F", "#0088FE", "#FFBB28", "#FF8042", "#A78BFA"];

  const chartData = expenseSummary.topCategories.map((item, index) => ({
    ...item,
    fill: colors[index % colors.length],
  }));
  return (
    <div className="border xl:row-span-3 row-span-2 flex flex-col rounded-2xl bg-white shadow-md dark:bg-zinc-900">
      <div>
        <h3 className="px-7 pt-5 pb-2 text-lg font-semibold">
          Expense Summary
        </h3>
        <hr />
      </div>

      <div className="flex flex-1 items-center justify-center gap-6 px-7 pb-6 pt-4">
        <div className="relative h-40 w-40 shrink-0">
          <ResponsiveContainer width="100%" height={155}>
            <PieChart>
              <Pie
                data={chartData}
                dataKey="amount"
                nameKey="category"
                innerRadius={50}
                outerRadius={60}
                cx="50%"
                cy="50%"
                stroke="none"
                isAnimationActive={false}
                shape={(props) => (
                  <Sector {...props} fill={props.payload.fill} stroke="none" />
                )}
              />
            </PieChart>
          </ResponsiveContainer>

          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <span className="text-xl font-bold">
              ${expenseSummary.totalExpenses.toLocaleString()}
            </span>
          </div>
        </div>

        <ul className="min-w-0 flex flex-col justify-center gap-2 text-sm">
          {chartData.map((entry, index) => (
            <li key={`legend-${index}`} className="flex items-center gap-2">
              <span
                className="inline-block h-3 w-3 shrink-0 rounded-full"
                style={{ backgroundColor: colors[index % colors.length] }}
              />
              <span className="truncate">{entry.category}</span>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <hr />
        <p></p>
      </div>
    </div>
  );
}

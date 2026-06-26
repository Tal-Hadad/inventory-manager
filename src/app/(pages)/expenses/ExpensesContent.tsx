"use client";

import { useMemo, useState } from "react";
import { PieChart, Pie, Tooltip, ResponsiveContainer, Legend } from "recharts";

type Expense = {
  id: string;
  category: string;
  description: string | null;
  amount: number;
  spentAt: Date;
  createdAt: Date;
};

type ExpensesContentProps = {
  expenses: Expense[];
};

type ChartExpenseItem = {
  category: string;
  total: number;
  fill: string;
};

const COLORS = [
  "#1d4ed8",
  "#c47c5f",
  "#5b4b9a",
  "#2f855a",
  "#d97706",
  "#0f766e",
  "#dc2626",
  "#7c3aed",
  "#0088FE",
  "#00C49F",
  "#A78BFA",
];

function parseLocalDate(value: string, isEndDate = false) {
  if (!value) {
    return null;
  }

  const [year, month, day] = value.split("-").map(Number);

  if (!year || !month || !day) {
    return null;
  }

  if (isEndDate) {
    return new Date(year, month - 1, day, 23, 59, 59, 999);
  }

  return new Date(year, month - 1, day, 0, 0, 0, 0);
}

export default function ExpensesContent({ expenses }: ExpensesContentProps) {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const categories = useMemo(() => {
    return Array.from(
      new Set(
        expenses
          .map((expense) => expense.category || "Uncategorized")
          .filter(Boolean),
      ),
    ).sort((a, b) => a.localeCompare(b));
  }, [expenses]);

  const startDateObject = useMemo(() => parseLocalDate(startDate), [startDate]);
  const endDateObject = useMemo(() => parseLocalDate(endDate, true), [endDate]);

  const hasInvalidDateRange =
    startDateObject != null &&
    endDateObject != null &&
    startDateObject.getTime() > endDateObject.getTime();

  const filteredExpenses = useMemo(() => {
    if (hasInvalidDateRange) {
      return [];
    }

    return expenses.filter((expense) => {
      const expenseDate = new Date(expense.spentAt);
      const expenseCategory = expense.category || "Uncategorized";

      const matchesCategory =
        selectedCategory === "All" || expenseCategory === selectedCategory;

      const matchesStartDate = startDateObject
        ? expenseDate.getTime() >= startDateObject.getTime()
        : true;

      const matchesEndDate = endDateObject
        ? expenseDate.getTime() <= endDateObject.getTime()
        : true;

      return matchesCategory && matchesStartDate && matchesEndDate;
    });
  }, [
    expenses,
    selectedCategory,
    startDateObject,
    endDateObject,
    hasInvalidDateRange,
  ]);

  const chartData = useMemo<ChartExpenseItem[]>(() => {
    const totalsByCategory = filteredExpenses.reduce<Record<string, number>>(
      (acc, expense) => {
        const category = expense.category || "Uncategorized";
        acc[category] = (acc[category] ?? 0) + expense.amount;
        return acc;
      },
      {},
    );

    return Object.entries(totalsByCategory)
      .map(([category, total], index) => ({
        category,
        total,
        fill: COLORS[index % COLORS.length],
      }))
      .sort((a, b) => b.total - a.total);
  }, [filteredExpenses]);

  const totalAmount = useMemo(() => {
    return filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  }, [filteredExpenses]);

  const resetFilters = () => {
    setSelectedCategory("All");
    setStartDate("");
    setEndDate("");
  };

  return (
    <div className=" flex flex-col lg:flex-row gap-6  dark:bg-zinc-950 mt-7">
      <aside className="rounded-2xl  border p-6 shadow-sm dark:bg-zinc-900 bg-gray-150  w-full lg:w-2/7 ">
        <h2 className="text-2xl font-semibold ">Filter by Category and Date</h2>

        <div className="mt-6 space-y-5 ">
          <div className="space-y-2">
            <label htmlFor="category" className="text-sm font-medium ">
              Category
            </label>
            <select
              id="category"
              value={selectedCategory}
              onChange={(event) => setSelectedCategory(event.target.value)}
              className="w-full rounded-xl border border-zinc-600 px-3 py-2.5 text-sm  outline-none transition focus:border-slate-500 dark:bg-zinc-900 bg-gray-150"
            >
              <option value="All">All</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="startDate" className="text-sm font-medium ">
              Start Date
            </label>
            <input
              id="startDate"
              type="date"
              value={startDate}
              max={endDate || undefined}
              onChange={(event) => setStartDate(event.target.value)}
              className="w-full rounded-xl border border-zinc-600  px-3 py-2.5 text-sm  outline-none transition focus:border-slate-500"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="endDate" className="text-sm font-medium ">
              End Date
            </label>
            <input
              id="endDate"
              type="date"
              value={endDate}
              min={startDate || undefined}
              onChange={(event) => setEndDate(event.target.value)}
              className="w-full rounded-xl border border-zinc-600  px-3 py-2.5 text-sm  outline-none transition focus:border-slate-500"
            />
          </div>

          <button
            type="button"
            onClick={resetFilters}
            className="w-full rounded-xl border border-zinc-600 px-4 py-2.5 text-sm font-medium  transition hover:bg-slate-50"
          >
            Reset filters
          </button>
        </div>
      </aside>

      <section className="rounded-2xl border p-6 shadow-sm dark:bg-zinc-900 bg-gray-150 w-full ">
        <div className="flex flex-col gap-2 border-b pb-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold ">Expense distribution</h2>
            <p className="text-sm text-zinc-500">
              Showing {filteredExpenses.length} expenses across{" "}
              {chartData.length} categories.
            </p>
          </div>

          <div className="text-sm">
            Total:{" "}
            <span className="font-semibold ">${totalAmount.toFixed(2)}</span>
          </div>
        </div>

        {hasInvalidDateRange ? (
          <div className="flex h-95 items-center justify-center text-sm text-red-600 ">
            End date must be greater than or equal to start date.
          </div>
        ) : chartData.length === 0 ? (
          <div className="flex h-95 items-center justify-center text-sm  ">
            No expenses found for the selected filters.
          </div>
        ) : (
          <div className=" w-full h-100 pt-6 ">
            <ResponsiveContainer
              width="100%"
              height="90%"
              initialDimension={{ width: 320, height: 320 }}
            >
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="total"
                  nameKey="category"
                  outerRadius={120}
                  label
                />
                <Tooltip
                  formatter={(value) => {
                    const amount = typeof value === "number" ? value : 0;
                    return [`$${amount.toFixed(2)}`, "Total"];
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </section>
    </div>
  );
}

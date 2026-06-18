import { Prisma } from "../../../prisma/app/generated/prisma/client";
import type { DashboardPeriod } from "./dashboardTypes";

type SalesRow = {
  soldAt: Date;
  totalAmount: Prisma.Decimal | number | bigint | null;
};

type SalesChartPoint = {
  date: string;
  totalValue: number;
};

function startOfDay(date: Date) {
  const value = new Date(date);
  value.setHours(0, 0, 0, 0);
  return value;
}

function addDays(date: Date, amount: number) {
  const value = new Date(date);
  value.setDate(value.getDate() + amount);
  return value;
}

function startOfWeek(date: Date) {
  const value = startOfDay(date);
  const day = value.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  value.setDate(value.getDate() + diff);
  return value;
}

function addWeeks(date: Date, amount: number) {
  return addDays(date, amount * 7);
}

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function addMonths(date: Date, amount: number) {
  return new Date(date.getFullYear(), date.getMonth() + amount, 1);
}

function getBucketStart(date: Date, period: DashboardPeriod) {
  if (period === "last12Months") {
    return startOfMonth(date);
  }

  if (period === "last90Days") {
    return startOfWeek(date);
  }

  return startOfDay(date);
}

function getExpectedBuckets(
  period: DashboardPeriod,
  currentStart: Date,
): string[] {
  if (period === "last12Months") {
    return Array.from({ length: 12 }, (_, index) =>
      addMonths(startOfMonth(currentStart), index).toISOString(),
    );
  }

  if (period === "last90Days") {
    const firstWeek = startOfWeek(currentStart);

    return Array.from({ length: 13 }, (_, index) =>
      addWeeks(firstWeek, index).toISOString(),
    );
  }

  const totalDays = period === "last7Days" ? 7 : 30;

  return Array.from({ length: totalDays }, (_, index) =>
    addDays(startOfDay(currentStart), index).toISOString(),
  );
}

export function buildSalesChart(
  salesRows: SalesRow[],
  period: DashboardPeriod,
  currentStart: Date,
): SalesChartPoint[] {
  const totals = new Map<string, number>();

  for (const sale of salesRows) {
    const bucketStart = getBucketStart(sale.soldAt, period);
    const key = bucketStart.toISOString();
    const currentValue = totals.get(key) ?? 0;

    totals.set(key, currentValue + Number(sale.totalAmount ?? 0));
  }

  return getExpectedBuckets(period, currentStart).map((bucket) => ({
    date: bucket,
    totalValue: totals.get(bucket) ?? 0,
  }));
}

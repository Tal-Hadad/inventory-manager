import type { DashboardPeriod } from "./dashboardTypes";

export function getPeriodRanges(period: DashboardPeriod) {
  const now = new Date();

  const currentEnd = new Date(now);
  currentEnd.setHours(23, 59, 59, 999);

  if (period === "last7Days") {
    const currentStart = new Date(now);
    currentStart.setDate(currentStart.getDate() - 6);
    currentStart.setHours(0, 0, 0, 0);

    const previousEnd = new Date(currentStart);
    previousEnd.setMilliseconds(previousEnd.getMilliseconds() - 1);

    const previousStart = new Date(currentStart);
    previousStart.setDate(previousStart.getDate() - 7);

    return { currentStart, currentEnd, previousStart, previousEnd };
  }

  if (period === "last30Days") {
    const currentStart = new Date(now);
    currentStart.setDate(currentStart.getDate() - 29);
    currentStart.setHours(0, 0, 0, 0);

    const previousEnd = new Date(currentStart);
    previousEnd.setMilliseconds(previousEnd.getMilliseconds() - 1);

    const previousStart = new Date(currentStart);
    previousStart.setDate(previousStart.getDate() - 30);

    return { currentStart, currentEnd, previousStart, previousEnd };
  }

  if (period === "last90Days") {
    const currentStart = new Date(now);
    currentStart.setDate(currentStart.getDate() - 89);
    currentStart.setHours(0, 0, 0, 0);

    const previousEnd = new Date(currentStart);
    previousEnd.setMilliseconds(previousEnd.getMilliseconds() - 1);

    const previousStart = new Date(currentStart);
    previousStart.setDate(previousStart.getDate() - 90);

    return { currentStart, currentEnd, previousStart, previousEnd };
  }

  const currentStart = new Date(now);
  currentStart.setMonth(currentStart.getMonth() - 11);
  currentStart.setDate(1);
  currentStart.setHours(0, 0, 0, 0);

  const previousEnd = new Date(currentStart);
  previousEnd.setMilliseconds(previousEnd.getMilliseconds() - 1);

  const previousStart = new Date(currentStart);
  previousStart.setMonth(previousStart.getMonth() - 12);

  return { currentStart, currentEnd, previousStart, previousEnd };
}

import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getDemoDashboardOverview } from "@/lib/dashboard/getDemoDashboardOverview";
import { getUserDashboardOverview } from "@/lib/dashboard/getUserDashboardOverview";
import type { DashboardPeriod } from "@/lib/dashboard/dashboardTypes";

const validPeriods: DashboardPeriod[] = [
  "last7Days",
  "last30Days",
  "last90Days",
  "last12Months",
];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const periodParam = searchParams.get("period");

    const period: DashboardPeriod = validPeriods.includes(
      periodParam as DashboardPeriod,
    )
      ? (periodParam as DashboardPeriod)
      : "last30Days";

    const session = await auth();

    const data = session?.user?.id
      ? await getUserDashboardOverview(session.user.id, period)
      : await getDemoDashboardOverview(period);

    return NextResponse.json({
      salesSummary: data.salesSummary,
      salesChart: data.salesChart,
    });
  } catch (error) {
    console.error("Sales summary API error:", error);

    return NextResponse.json(
      { error: "Failed to fetch sales summary" },
      { status: 500 },
    );
  }
}

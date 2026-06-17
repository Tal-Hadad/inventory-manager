import { auth } from "@/auth";
import { getDemoDashboardOverview } from "@/lib/dashboard/getDemoDashboardOverview";
import { getUserDashboardOverview } from "@/lib/dashboard/getUserDashboardOverview";
import { DashboardView } from "@/components/dashboardView";

export default async function DashboardPage() {
  const session = await auth();

  const data = session?.user?.id
    ? await getUserDashboardOverview(session.user.id)
    : await getDemoDashboardOverview();

  return <DashboardView data={data} />;
}

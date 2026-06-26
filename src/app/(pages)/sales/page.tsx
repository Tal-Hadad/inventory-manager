import PageHeader from "@/components/PageHeader";
import { auth } from "@/auth";
import { getDemoSales } from "@/lib/sales/getDemoSales";
import { getUserSales } from "@/lib/sales/getUserSales";
import SalesTable from "@/app/(pages)/sales/SalesTable";

type SalesPageProps = {
  searchParams?: Promise<{
    search?: string;
  }>;
};

export default async function SalesPage({ searchParams }: SalesPageProps) {
  const session = await auth();
  const params = await searchParams;
  const search = params?.search;

  const sales = session?.user?.id
    ? await getUserSales({ search })
    : await getDemoSales({ search });

  const isDemo = !session?.user?.id;
  const errorMessage = "Failed to load sales data";

  if (!sales) {
    throw new Error(errorMessage);
  }

  return (
    <div>
      <PageHeader name="Sales" isDemo={isDemo} />
      <SalesTable rows={sales} />
    </div>
  );
}

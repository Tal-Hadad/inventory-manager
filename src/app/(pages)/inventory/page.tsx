import PageHeader from "@/components/PageHeader";
import { auth } from "@/auth";
import { getDemoProducts } from "@/lib/products/getDemoProducts";
import { getUserProducts } from "@/lib/products/getUserProducts";
import InventoryTable from "@/components/InventoryTable";

type InventoryPageProps = {
  searchParams?: Promise<{
    search?: string;
  }>;
};

export default async function InventoryPage({
  searchParams,
}: InventoryPageProps) {
  const session = await auth();
  const params = await searchParams;
  const search = params?.search;

  const products = session?.user?.id
    ? await getUserProducts(session.user.id, { search })
    : await getDemoProducts({ search });

  const isDemo = !session?.user?.id;

  return (
    <div>
      <PageHeader name="Inventory" isDemo={isDemo} />
      <InventoryTable rows={products} />
    </div>
  );
}

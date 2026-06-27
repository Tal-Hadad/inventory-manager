import PageHeader from "@/components/PageHeader";
import { auth } from "@/auth";
import { getDemoProducts } from "@/lib/products/getDemoProducts";
import { getUserProducts } from "@/lib/products/getUserProducts";
import InventoryTable from "@/app/(pages)/inventory/InventoryTable";

export default async function InventoryPage() {
  const session = await auth();

  const products = session?.user?.id
    ? await getUserProducts(session.user.id)
    : await getDemoProducts();

  const isDemo = !session?.user?.id;
  const errorMessage = "Failed to load inventory data";
  if (!products) {
    throw new Error(errorMessage);
  }

  return (
    <div>
      <PageHeader name="Inventory" isDemo={isDemo} />
      <InventoryTable rows={products} />
    </div>
  );
}

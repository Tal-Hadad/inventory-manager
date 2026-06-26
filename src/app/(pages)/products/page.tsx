import { auth } from "@/auth";
import PageHeader from "@/components/PageHeader";
import { getDemoProducts } from "@/lib/products/getDemoProducts";
import { getUserProducts } from "@/lib/products/getUserProducts";
import ProductsContent from "./ProductsContent";

export default async function ProductsPage() {
  const session = await auth();
  const products = session?.user?.id
    ? await getUserProducts(session.user.id, {})
    : await getDemoProducts({});

  const isDemo = !session?.user?.id;

  const errorMessage = "Failed to load products";
  if (!products) {
    throw new Error(errorMessage);
  }
  return (
    <div>
      <PageHeader name="Products" isDemo={isDemo} showTitle={false} />
      <ProductsContent product={products} />
    </div>
  );
}

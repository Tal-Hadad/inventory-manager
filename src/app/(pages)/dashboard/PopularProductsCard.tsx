import type { DashboardOverview } from "@/lib/dashboard/dashboardTypes";
import Rating from "@/components/ui/Rating";
import { PackageCheck, ShoppingBag } from "lucide-react";

interface PopularProductsCardProps {
  products: DashboardOverview["popularProducts"];
}

export default function PopularProductsCard({
  products = [],
}: PopularProductsCardProps) {
  return (
    <div className="row-span-3 xl:row-span-6 dark:bg-zinc-900 shadow-md rounded-2xl pb-16">
      <h3 className="text-lg font-semibold px-7 pt-5 pb-2">Popular Products</h3>
      <hr />
      <div className="overflow-auto h-full">
        {products.map((product) => (
          <div
            key={product.productId}
            className="flex items-center justify-between gap-3 px-5 py-7 border-b"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-md bg-zinc-100 dark:bg-zinc-800">
                {product.imageKey ? (
                  <img
                    src={product.imageKey}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <PackageCheck className="h-5 w-5 text-zinc-500" />
                )}
              </div>

              <div className="flex flex-col justify-between gap-1 ">
                <div>
                  <p className="font-semibold">{product.name}</p>

                  <div className="flex text-sm items-center">
                    <span className="font-bold text-blue-500 text-xs">
                      ${product.price}
                    </span>
                    <span className="mx-2"> | </span>
                    <div>
                      <Rating rating={product.rating} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <section className="text-xs flex items-center">
              <button className="p-2 rounded-full bg-blue-100 text-blue-600 mr-2 hover:bg-blue-200 hover:text-blue-700">
                <ShoppingBag className="w-4 h-4" />
              </button>
              {Math.round(product.quantitySold)}sold
            </section>
          </div>
        ))}
      </div>
    </div>
  );
}

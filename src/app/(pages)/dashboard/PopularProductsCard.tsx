import Rating from "@/components/ui/Rating";
import type { DashboardOverview } from "@/lib/dashboard/dashboardTypes";
import { ShoppingBag } from "lucide-react";
import Image from "next/image";

interface PopularProductsCardProps {
  products: DashboardOverview["popularProducts"];
}

export default function PopularProductsCard({
  products = [],
}: PopularProductsCardProps) {
  return (
    <div className="row-span-3 xl:row-span-6 bg-white dark:bg-zinc-900  shadow-md rounded-2xl pb-16">
      <h3 className="text-lg font-semibold px-7 pt-5 pb-2">Popular Products</h3>
      <hr />
      <div className="overflow-auto h-full">
        {products.map((product) => (
          <div
            key={product.productId}
            className="flex items-center justify-between gap-3 px-5 py-7 border-b"
          >
            <div className="flex items-center gap-3">
              <Image
                src="https://placehold.net/product.svg"
                width={50}
                height={50}
                alt="Product Image"
              ></Image>
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

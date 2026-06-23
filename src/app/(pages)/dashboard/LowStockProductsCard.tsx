import type { DashboardOverview } from "@/lib/dashboard/dashboardTypes";
import { PackageX } from "lucide-react";

interface LowStockProductsCardProps {
  lowStockSummary: DashboardOverview["lowStockSummary"];
}

function getStockStatus(stockQuantity: number, reorderPoint: number) {
  if (stockQuantity === 0) {
    return {
      label: "Out of stock",
      badgeClass:
        "bg-red-500/15 text-red-400 ring-1 ring-inset ring-red-500/30",
    };
  }

  if (stockQuantity <= reorderPoint / 2) {
    return {
      label: "Critical",
      badgeClass:
        "bg-orange-500/15 text-orange-400 ring-1 ring-inset ring-orange-500/30",
    };
  }

  return {
    label: "Low",
    badgeClass:
      "bg-yellow-500/15 text-yellow-400 ring-1 ring-inset ring-yellow-500/30",
  };
}

export default function LowStockProductsCard({
  lowStockSummary,
}: LowStockProductsCardProps) {
  const products = lowStockSummary.products ?? [];
  const hasProducts = products.length > 0;

  return (
    <div className="row-span-3 xl:row-span-6 dark:bg-zinc-900 shadow-md rounded-2xl flex min-h-0 flex-col">
      <div className="flex items-center justify-between px-7 pt-5 pb-3">
        <div>
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            Low Stock Products
          </h3>
        </div>

        <div className="flex min-w-11 items-center justify-center rounded-full bg-amber-500/10 px-4 text-sm font-semibold text-amber-500 dark:bg-amber-400/10 dark:text-amber-300">
          {lowStockSummary.totalLowStockProducts}
        </div>
      </div>

      <div className="border-t border-zinc-200 dark:border-zinc-800" />

      {!hasProducts ? (
        <div className="flex flex-col items-center justify-center text-center">
          <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 text-2xl mt-5">
            ✅
          </div>
          <h4 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
            Stock levels look good
          </h4>
          <p className="mt-2 max-w-xs text-sm text-zinc-500 dark:text-zinc-400">
            No products are currently below their reorder point.
          </p>
        </div>
      ) : (
        <div className="flex-1 min-h-0 overflow-y-auto divide-zinc-200 dark:divide-zinc-800">
          {products.map((product) => {
            const status = getStockStatus(
              product.stockQuantity,
              product.reorderPoint,
            );

            return (
              <div
                key={product.productId}
                className="flex items-start justify-between gap-4 px-7 py-4"
              >
                <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-md bg-zinc-100 dark:bg-zinc-800">
                  {product.imageKey ? (
                    <img
                      src={product.imageKey}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <PackageX className="h-5 w-5 text-zinc-500" />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="truncate text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                      {product.name}
                    </h4>

                    <span
                      className={`inline-flex shrink-0 items-center rounded-full px-2 py-1 text-[11px] font-medium ${status.badgeClass}`}
                    >
                      {status.label}
                    </span>
                  </div>

                  <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-zinc-500 dark:text-zinc-400">
                    <span>SKU: {product.sku ?? "N/A"}</span>
                    <span>Reorder at: {product.reorderPoint}</span>
                    <span>Product cost: ${product.costPrice}</span>
                  </div>

                  <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
                    <div
                      className={`h-full rounded-full ${
                        product.stockQuantity === 0
                          ? "bg-red-500"
                          : product.stockQuantity <= product.reorderPoint / 2
                            ? "bg-orange-500"
                            : "bg-yellow-500"
                      }`}
                      style={{
                        width: `${Math.min(
                          (product.stockQuantity /
                            Math.max(product.reorderPoint, 1)) *
                            100,
                          100,
                        )}%`,
                      }}
                    />
                  </div>
                </div>

                <div className="shrink-0 text-right">
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    Current
                  </p>
                  <p className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                    {product.stockQuantity}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

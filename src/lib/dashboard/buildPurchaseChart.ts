type PurchaseRow = {
  purchasedAt: Date;
  totalCost: number;
};

export function buildPurchaseChart(rows: PurchaseRow[]) {
  const now = new Date();
  const start = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 5, 1),
  );

  const buckets = new Map<string, number>();

  for (let index = 0; index < 6; index += 1) {
    const date = new Date(
      Date.UTC(start.getUTCFullYear(), start.getUTCMonth() + index, 1),
    );

    const key = `${date.getUTCFullYear()}-${String(
      date.getUTCMonth() + 1,
    ).padStart(2, "0")}`;

    buckets.set(key, 0);
  }

  for (const row of rows) {
    const purchasedAt = new Date(row.purchasedAt);

    if (purchasedAt < start) {
      continue;
    }

    const key = `${purchasedAt.getUTCFullYear()}-${String(
      purchasedAt.getUTCMonth() + 1,
    ).padStart(2, "0")}`;

    if (!buckets.has(key)) {
      continue;
    }

    buckets.set(key, (buckets.get(key) ?? 0) + row.totalCost);
  }

  return Array.from(buckets.entries()).map(([date, totalPurchased]) => ({
    date,
    totalPurchased: Number(totalPurchased.toFixed(2)),
  }));
}

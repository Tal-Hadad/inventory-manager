import { createSeededRandom, randomInt, roundToTwo } from "./seedUtils";

export type DemoPurchaseSeed = {
  sku: string;
  quantity: number;
  unitCost: number;
  totalCost: number;
  purchasedAt: Date;
};

const demoPurchaseProducts = [
  { sku: "COFFEE-001", baseCost: 30, minQty: 20, maxQty: 70 },
  { sku: "MILK-001", baseCost: 6, minQty: 25, maxQty: 90 },
  { sku: "SUGAR-001", baseCost: 4, minQty: 15, maxQty: 55 },
  { sku: "BREAD-001", baseCost: 8, minQty: 15, maxQty: 45 },
  { sku: "EGGS-001", baseCost: 12, minQty: 12, maxQty: 40 },
  { sku: "RICE-001", baseCost: 6.5, minQty: 30, maxQty: 100 },
  { sku: "PASTA-001", baseCost: 5, minQty: 20, maxQty: 65 },
  { sku: "OIL-001", baseCost: 24, minQty: 10, maxQty: 35 },
  { sku: "BUTTER-001", baseCost: 10, minQty: 12, maxQty: 40 },
  { sku: "CHEESE-001", baseCost: 16, minQty: 8, maxQty: 28 },
  { sku: "TEA-001", baseCost: 11, minQty: 12, maxQty: 50 },
  { sku: "JUICE-001", baseCost: 7.5, minQty: 15, maxQty: 45 },
  { sku: "CEREAL-001", baseCost: 12, minQty: 10, maxQty: 32 },
  { sku: "COOKIES-001", baseCost: 6.5, minQty: 18, maxQty: 55 },
  { sku: "CHIPS-001", baseCost: 5.5, minQty: 20, maxQty: 75 },
  { sku: "DETERGENT-001", baseCost: 21, minQty: 8, maxQty: 24 },
  { sku: "DISH-001", baseCost: 6.5, minQty: 12, maxQty: 36 },
  { sku: "TP-001", baseCost: 18, minQty: 10, maxQty: 30 },
  { sku: "SOAP-001", baseCost: 4.5, minQty: 15, maxQty: 50 },
  { sku: "SHAMPOO-001", baseCost: 13, minQty: 8, maxQty: 28 },
] as const;

function getPurchaseSeasonMultiplier(month: number) {
  const seasonalMap = [
    0.96, 0.94, 0.98, 1, 1.02, 1.05, 1.08, 1.06, 1.03, 1.01, 1.04, 1.1,
  ];

  return seasonalMap[month];
}
function generateDemoPurchases(): DemoPurchaseSeed[] {
  const rand = createSeededRandom(20260619);
  const purchases: DemoPurchaseSeed[] = [];
  const startDate = new Date("2025-06-01T00:00:00.000Z");
  const endDate = new Date("2026-06-18T00:00:00.000Z");

  for (
    let current = new Date(startDate);
    current <= endDate;
    current.setUTCDate(current.getUTCDate() + 1)
  ) {
    const dayOfWeek = current.getUTCDay();

    if (dayOfWeek === 0) {
      continue;
    }

    const purchaseChance = dayOfWeek === 1 || dayOfWeek === 4 ? 0.55 : 0.3;

    if (rand() > purchaseChance) {
      continue;
    }

    const transactionCount = rand() > 0.75 ? 2 : 1;

    for (let index = 0; index < transactionCount; index += 1) {
      const product =
        demoPurchaseProducts[
          randomInt(rand, 0, demoPurchaseProducts.length - 1)
        ];

      const month = current.getUTCMonth();
      const seasonalMultiplier = getPurchaseSeasonMultiplier(month);
      const noiseMultiplier = 0.92 + rand() * 0.22;

      const quantity = Math.max(
        1,
        Math.round(
          randomInt(rand, product.minQty, product.maxQty) *
            seasonalMultiplier *
            noiseMultiplier,
        ),
      );

      const unitCost = roundToTwo(product.baseCost * (0.96 + rand() * 0.09));

      const purchasedAt = new Date(current);
      purchasedAt.setUTCHours(
        randomInt(rand, 6, 14),
        randomInt(rand, 0, 59),
        0,
        0,
      );

      purchases.push({
        sku: product.sku,
        quantity,
        unitCost,
        totalCost: roundToTwo(quantity * unitCost),
        purchasedAt,
      });
    }
  }

  return purchases.sort(
    (a, b) => a.purchasedAt.getTime() - b.purchasedAt.getTime(),
  );
}

export const demoPurchases: DemoPurchaseSeed[] = generateDemoPurchases();

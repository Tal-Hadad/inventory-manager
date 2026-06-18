import { createSeededRandom, randomInt, roundToTwo } from "./seedUtils";

export type DemoSaleSeed = {
  sku: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  soldAt: Date;
};

const demoSaleProducts = [
  { sku: "COFFEE-001", basePrice: 42, minQty: 50, maxQty: 110 },
  { sku: "MILK-001", basePrice: 8.5, minQty: 90, maxQty: 180 },
  { sku: "BREAD-001", basePrice: 12, minQty: 60, maxQty: 130 },
  { sku: "EGGS-001", basePrice: 18, minQty: 45, maxQty: 100 },
  { sku: "RICE-001", basePrice: 9.5, minQty: 70, maxQty: 140 },
  { sku: "PASTA-001", basePrice: 7.5, minQty: 70, maxQty: 140 },
  { sku: "OIL-001", basePrice: 32, minQty: 18, maxQty: 55 },
  { sku: "BUTTER-001", basePrice: 14, minQty: 40, maxQty: 95 },
  { sku: "CHEESE-001", basePrice: 22, minQty: 25, maxQty: 70 },
  { sku: "TEA-001", basePrice: 16, minQty: 35, maxQty: 90 },
  { sku: "COOKIES-001", basePrice: 10, minQty: 50, maxQty: 140 },
  { sku: "CHIPS-001", basePrice: 9, minQty: 70, maxQty: 170 },
  { sku: "JUICE-001", basePrice: 11, minQty: 45, maxQty: 120 },
  { sku: "CEREAL-001", basePrice: 18, minQty: 25, maxQty: 80 },
  { sku: "DETERGENT-001", basePrice: 28, minQty: 15, maxQty: 45 },
  { sku: "DISH-001", basePrice: 9.5, minQty: 40, maxQty: 100 },
  { sku: "TP-001", basePrice: 24, minQty: 20, maxQty: 75 },
  { sku: "SOAP-001", basePrice: 7, minQty: 45, maxQty: 120 },
  { sku: "SHAMPOO-001", basePrice: 19, minQty: 18, maxQty: 65 },
] as const;

function getSeasonMultiplier(month: number) {
  const seasonalMap = [
    0.92, 0.9, 0.95, 1, 1.03, 1.08, 1.12, 1.1, 1.04, 1.01, 1.06, 1.18,
  ];

  return seasonalMap[month];
}

function generateDemoSales(): DemoSaleSeed[] {
  const rand = createSeededRandom(20260618);
  const sales: DemoSaleSeed[] = [];
  const startDate = new Date("2025-06-01T00:00:00.000Z");
  const endDate = new Date("2026-06-18T00:00:00.000Z");

  for (
    let current = new Date(startDate);
    current <= endDate;
    current.setUTCDate(current.getUTCDate() + 1)
  ) {
    const dayOfWeek = current.getUTCDay();
    const isWeekend = dayOfWeek === 5 || dayOfWeek === 6;
    const baseTransactions = isWeekend ? 5 : 3;
    const extraTransactions = rand() > 0.7 ? 2 : rand() > 0.4 ? 1 : 0;
    const transactionCount = baseTransactions + extraTransactions;

    for (let index = 0; index < transactionCount; index += 1) {
      const product =
        demoSaleProducts[randomInt(rand, 0, demoSaleProducts.length - 1)];

      const month = current.getUTCMonth();
      const seasonalMultiplier = getSeasonMultiplier(month);
      const trendMultiplier =
        0.88 +
        ((current.getTime() - startDate.getTime()) /
          (endDate.getTime() - startDate.getTime())) *
          0.28;
      const noiseMultiplier = 0.9 + rand() * 0.25;

      const quantity = Math.max(
        1,
        Math.round(
          randomInt(rand, product.minQty, product.maxQty) *
            seasonalMultiplier *
            trendMultiplier *
            noiseMultiplier,
        ),
      );

      const unitPrice = roundToTwo(product.basePrice * (0.97 + rand() * 0.08));

      const soldAt = new Date(current);
      soldAt.setUTCHours(randomInt(rand, 7, 19), randomInt(rand, 0, 59), 0, 0);

      sales.push({
        sku: product.sku,
        quantity,
        unitPrice,
        totalAmount: roundToTwo(quantity * unitPrice),
        soldAt,
      });
    }
  }

  return sales.sort((a, b) => a.soldAt.getTime() - b.soldAt.getTime());
}

export const demoSales: DemoSaleSeed[] = generateDemoSales();

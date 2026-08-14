import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "./app/generated/prisma/client";

import { demoProducts } from "./seedData/demoProducts";
import { demoSales } from "./seedData/demoSales";
import { demoPurchases } from "./seedData/demoPurchases";
import { demoExpenses } from "./seedData/demoExpenses";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

function daysAgo(days: number) {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date;
}

async function main() {
  console.log("🌱 seeding demo data...");

  await prisma.demoSale.deleteMany();
  await prisma.demoPurchase.deleteMany();
  await prisma.demoExpense.deleteMany();

  const existingProducts = await prisma.demoProduct.findMany({
    select: {
      id: true,
      sku: true,
    },
  });

  const existingProductIdBySku = new Map(
    existingProducts
      .filter((product) => product.sku)
      .map((product) => [product.sku as string, product.id]),
  );

  const createdProducts = await Promise.all(
    demoProducts.map((product) => {
      const existingId = existingProductIdBySku.get(product.sku);

      if (existingId) {
        return prisma.demoProduct.findUniqueOrThrow({
          where: { id: existingId },
        });
      }

      return prisma.demoProduct.create({
        data: product,
      });
    }),
  );
  const productIdBySku = new Map(
    createdProducts
      .filter((product) => product.sku)
      .map((product) => [product.sku as string, product.id]),
  );

  await prisma.demoSale.createMany({
    data: demoSales.map((sale) => ({
      productId: productIdBySku.get(sale.sku)!,
      quantity: sale.quantity,
      unitPrice: sale.unitPrice,
      totalAmount: sale.totalAmount,
      soldAt: daysAgo(Math.floor(Math.random() * 30)),
    })),
  });

  await prisma.demoPurchase.createMany({
    data: demoPurchases.map((purchase) => ({
      productId: productIdBySku.get(purchase.sku)!,
      quantity: purchase.quantity,
      unitCost: purchase.unitCost,
      totalCost: purchase.totalCost,
      purchasedAt: daysAgo(Math.floor(Math.random() * 30)),
    })),
  });

  await prisma.demoExpense.createMany({
    data: demoExpenses.map((expense) => ({
      category: expense.category,
      description: expense.description,
      amount: expense.amount,
      spentAt: daysAgo(Math.floor(Math.random() * 30)),
    })),
  });

  console.log("✅ Demo data seeded successfully.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
    await pool.end();
  })
  .catch(async (error) => {
    console.error("❌ Seed failed:", error);
    await prisma.$disconnect();
    await pool.end();
    process.exit(1);
  });

/*
  Warnings:

  - A unique constraint covering the columns `[sku]` on the table `demo_products` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "demo_products_sku_key" ON "demo_products"("sku");

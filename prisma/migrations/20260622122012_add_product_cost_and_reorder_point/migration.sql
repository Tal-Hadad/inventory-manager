-- AlterTable
ALTER TABLE "demo_expenses" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "demo_products" ADD COLUMN     "cost_price" DECIMAL(10,2),
ADD COLUMN     "reorder_point" INTEGER DEFAULT 5;

-- AlterTable
ALTER TABLE "demo_purchases" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "demo_sales" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "products" ADD COLUMN     "cost_price" DECIMAL(10,2),
ADD COLUMN     "reorder_point" INTEGER DEFAULT 5;

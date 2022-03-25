/*
  Warnings:

  - You are about to drop the `containts` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "containts" DROP CONSTRAINT "containts_cart_id_fkey";

-- DropForeignKey
ALTER TABLE "containts" DROP CONSTRAINT "containts_product_id_fkey";

-- DropTable
DROP TABLE "containts";

-- CreateTable
CREATE TABLE "contain" (
    "id" TEXT NOT NULL,
    "cart_id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,

    CONSTRAINT "contain_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "contain" ADD CONSTRAINT "contain_cart_id_fkey" FOREIGN KEY ("cart_id") REFERENCES "carts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contain" ADD CONSTRAINT "contain_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

/*
  Warnings:

  - You are about to drop the column `availableItems` on the `SupplierShop` table. All the data in the column will be lost.
  - You are about to drop the column `latitude` on the `SupplierShop` table. All the data in the column will be lost.
  - You are about to drop the column `longitude` on the `SupplierShop` table. All the data in the column will be lost.
  - Added the required column `ownerId` to the `SupplierShop` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SupplierShop" DROP COLUMN "availableItems",
DROP COLUMN "latitude",
DROP COLUMN "longitude",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "ownerId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "unit" TEXT NOT NULL,
    "supplierShopId" TEXT NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SupplierShop" ADD CONSTRAINT "SupplierShop_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_supplierShopId_fkey" FOREIGN KEY ("supplierShopId") REFERENCES "SupplierShop"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

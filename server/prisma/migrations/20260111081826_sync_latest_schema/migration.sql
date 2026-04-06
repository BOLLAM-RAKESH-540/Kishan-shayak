-- CreateEnum
CREATE TYPE "ListingType" AS ENUM ('LIVESTOCK', 'MILK');

-- DropForeignKey
ALTER TABLE "Expense" DROP CONSTRAINT "Expense_userId_fkey";

-- DropForeignKey
ALTER TABLE "FarmProfile" DROP CONSTRAINT "FarmProfile_userId_fkey";

-- DropForeignKey
ALTER TABLE "SupplierShop" DROP CONSTRAINT "SupplierShop_ownerId_fkey";

-- DropForeignKey
ALTER TABLE "VehicleRental" DROP CONSTRAINT "VehicleRental_userId_fkey";

-- DropForeignKey
ALTER TABLE "VehicleWork" DROP CONSTRAINT "VehicleWork_userId_fkey";

-- AlterTable
ALTER TABLE "Expense" ADD COLUMN     "farmId" TEXT;

-- AlterTable
ALTER TABLE "FarmProfile" ADD COLUMN     "endDate" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "HusbandryListing" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "ListingType" NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "address" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "species" TEXT,
    "breed" TEXT,
    "ageMonths" INTEGER,
    "imageUrl" TEXT,
    "milkType" TEXT,
    "quantityLiters" DOUBLE PRECISION,
    "expiresAt" TIMESTAMP(3),

    CONSTRAINT "HusbandryListing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReferenceCrop" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "image" TEXT,

    CONSTRAINT "ReferenceCrop_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Disease" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "symptoms" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "cropId" INTEGER NOT NULL,

    CONSTRAINT "Disease_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Treatment" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "dosage" TEXT NOT NULL,
    "instructions" TEXT,
    "diseaseId" INTEGER NOT NULL,

    CONSTRAINT "Treatment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "HusbandryListing_userId_idx" ON "HusbandryListing"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "ReferenceCrop_name_key" ON "ReferenceCrop"("name");

-- CreateIndex
CREATE INDEX "Expense_userId_idx" ON "Expense"("userId");

-- CreateIndex
CREATE INDEX "Expense_farmId_idx" ON "Expense"("farmId");

-- CreateIndex
CREATE INDEX "FarmProfile_userId_status_idx" ON "FarmProfile"("userId", "status");

-- CreateIndex
CREATE INDEX "SupplierShop_ownerId_idx" ON "SupplierShop"("ownerId");

-- CreateIndex
CREATE INDEX "User_phoneNumber_idx" ON "User"("phoneNumber");

-- CreateIndex
CREATE INDEX "VehicleRental_userId_idx" ON "VehicleRental"("userId");

-- CreateIndex
CREATE INDEX "VehicleWork_userId_idx" ON "VehicleWork"("userId");

-- AddForeignKey
ALTER TABLE "HusbandryListing" ADD CONSTRAINT "HusbandryListing_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("phoneNumber") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FarmProfile" ADD CONSTRAINT "FarmProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("phoneNumber") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Expense" ADD CONSTRAINT "Expense_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("phoneNumber") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Expense" ADD CONSTRAINT "Expense_farmId_fkey" FOREIGN KEY ("farmId") REFERENCES "FarmProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SupplierShop" ADD CONSTRAINT "SupplierShop_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("phoneNumber") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VehicleWork" ADD CONSTRAINT "VehicleWork_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("phoneNumber") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VehicleRental" ADD CONSTRAINT "VehicleRental_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("phoneNumber") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Disease" ADD CONSTRAINT "Disease_cropId_fkey" FOREIGN KEY ("cropId") REFERENCES "ReferenceCrop"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Treatment" ADD CONSTRAINT "Treatment_diseaseId_fkey" FOREIGN KEY ("diseaseId") REFERENCES "Disease"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

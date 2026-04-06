-- CreateTable
CREATE TABLE "VehicleRental" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "vehicleName" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "pricePerHour" DOUBLE PRECISION NOT NULL,
    "contactPhone" TEXT NOT NULL,
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,
    "imageUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VehicleRental_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "VehicleRental" ADD CONSTRAINT "VehicleRental_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// 1. List a new Vehicle for Rent
export const createRental = async (req: Request, res: Response) => {
  try {
    // 🟢 Using phoneNumber from Auth Middleware (verified string)
    const userPhone = (req as any).phoneNumber;
    const { vehicleName, type, pricePerHour, location, contactPhone, imageUrl } = req.body;

    if (!vehicleName || !pricePerHour || !contactPhone) {
      return res.status(400).json({ message: "Please fill all required fields" });
    }

    const newRental = await prisma.vehicleRental.create({
      data: {
        userId: String(userPhone), // 🟢 Linked via Phone Number String
        vehicleName,
        type,
        location,
        pricePerHour: parseFloat(pricePerHour),
        contactPhone,
        imageUrl: imageUrl || null
      }
    });

    res.status(201).json({ message: "Vehicle listed successfully!", rental: newRental });
  } catch (error: any) {
    console.error("❌ Error creating rental:", error);
    res.status(500).json({ message: "Server Error", details: error.message });
  }
};

// 2. Get All Vehicles Available for Rent
export const getAllRentals = async (req: Request, res: Response) => {
  try {
    const rentals = await prisma.vehicleRental.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            name: true,
            phoneNumber: true // 🟢 Useful for frontend contact buttons
          }
        }
      }
    });
    res.json(rentals);
  } catch (error) {
    console.error("❌ Error fetching rentals:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// 3. Delete a Rental Listing
export const deleteRental = async (req: Request, res: Response) => {
  try {
    const { id } = req.params; // The Listing UUID
    const userPhone = (req as any).phoneNumber; // 🟢 Get logged-in user's Phone Number

    // Step A: Verify the listing exists
    const existingRental = await prisma.vehicleRental.findUnique({
      where: { id: id }
    });

    if (!existingRental) {
      return res.status(404).json({ message: "Rental listing not found" });
    }

    // Security Check: 🟢 Verify the owner phone number matches the token phone number
    if (existingRental.userId !== userPhone) {
      return res.status(403).json({ message: "You are not authorized to delete this listing" });
    }

    // Step B: Proceed with deletion
    await prisma.vehicleRental.delete({
      where: { id: id }
    });

    res.status(200).json({ message: "Vehicle listing deleted successfully" });

  } catch (error) {
    console.error("❌ Error deleting rental:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
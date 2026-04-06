import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// 1. Add New Work Entry (Log for Tractor/Harvester work)
export const addVehicleWork = async (req: Request, res: Response) => {
  try {
    // 🟢 Using phoneNumber from Auth Middleware (the verified string)
    const userPhone = (req as any).phoneNumber; 
    const { customerName, customerPhone, vehicleName, workDate, amount } = req.body;

    if (!userPhone) {
      return res.status(401).json({ message: "Unauthorized: User identification missing" });
    }

    const newWork = await prisma.vehicleWork.create({
      data: {
        userId: String(userPhone), // 🟢 Linked via owner's Phone Number
        customerName,
        customerPhone, // The phone number of the customer who hired the vehicle
        vehicleName,
        workDate: new Date(workDate), 
        amount: parseFloat(amount),
      },
    });

    console.log(`✅ Work log added for vehicle owner: ${userPhone}`);
    res.status(201).json(newWork);
  } catch (error: any) {
    console.error("❌ Error adding vehicle work:", error);
    res.status(500).json({ message: "Failed to add work record", details: error.message });
  }
};

// 2. Get All Work Logs (for the logged-in owner)
export const getVehicleWorks = async (req: Request, res: Response) => {
  try {
    // 🟢 Get the verified phone number of the owner
    const userPhone = (req as any).phoneNumber || req.query.userId;
    const { search } = req.query; 

    if (!userPhone) {
      return res.status(400).json({ message: "User Phone Number is required" });
    }

    // Build the query
    const whereCondition: any = { 
        userId: String(userPhone) 
    };

    // 🟢 Optional: Filter by Customer Phone number
    if (search) {
      whereCondition.customerPhone = { 
        contains: String(search),
        mode: 'insensitive' // Makes search easier for users
      };
    }

    const works = await prisma.vehicleWork.findMany({
      where: whereCondition,
      orderBy: { workDate: 'desc' }, 
    });

    res.json(works);
  } catch (error) {
    console.error("❌ Error fetching vehicle works:", error);
    res.status(500).json({ message: "Failed to fetch records" });
  }
};
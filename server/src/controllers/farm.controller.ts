import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// 1. Add a New Farm
export const addFarm = async (req: Request, res: Response) => {
  try {
    const { userId, cropName, fieldSizeAcres, startDate, endDate } = req.body;
    
    // 🟢 AUTH LOGIC: Determine the actual Phone Number
    // The frontend might be sending a UUID or a Phone Number.
    // We need the Phone Number because the Schema uses it as the Foreign Key.
    let targetPhone = userId || (req as any).phoneNumber;

    if (!targetPhone) {
      return res.status(400).json({ message: "User identification is required" });
    }

    // 🛡️ SAFE RESOLVER: If userId is a UUID (contains dashes), look up the phone number
    if (targetPhone.includes('-')) {
      const user = await prisma.user.findUnique({
        where: { id: targetPhone },
        select: { phoneNumber: true }
      });
      if (user) {
        targetPhone = user.phoneNumber;
      } else {
        return res.status(404).json({ message: "User not found with provided ID" });
      }
    }

    if (!cropName || !fieldSizeAcres || !startDate) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const status = endDate ? 'HARVESTED' : 'ACTIVE';

    const newFarm = await prisma.farmProfile.create({
      data: {
        userId: String(targetPhone), // 🟢 Now guaranteed to be the Phone Number
        cropName,
        fieldSizeAcres: parseFloat(fieldSizeAcres),
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        status: status
      }
    });

    console.log(`✅ Farm Added: ${cropName} for Phone ${targetPhone}`);
    res.status(201).json(newFarm);
  } catch (error: any) {
    console.error("❌ Error adding farm:", error);
    res.status(500).json({ message: "Failed to add farm", error: error.message });
  }
};

// 2. Get All Farms for a User
export const getFarms = async (req: Request, res: Response) => {
  try {
    const rawUserId = req.params.userId || (req as any).phoneNumber; 
    
    if (!rawUserId) return res.status(400).json({ message: "User Phone Number is required" });

    // 🛡️ SAFE RESOLVER for GET
    let targetPhone = rawUserId;
    if (rawUserId.includes('-')) {
      const user = await prisma.user.findUnique({
        where: { id: rawUserId },
        select: { phoneNumber: true }
      });
      if (user) targetPhone = user.phoneNumber;
    }

    const farms = await prisma.farmProfile.findMany({
      where: { userId: String(targetPhone) }, 
      include: {
        expenses: true, 
        yields: true,
        activities: { orderBy: { appliedDate: 'desc' } }
      },
      orderBy: { startDate: 'desc' }
    });

    console.log(`✅ Success: Found ${farms.length} records for Phone ${targetPhone}`);
    res.json({ data: farms }); // Wrapped in 'data' to match your frontend expectation
  } catch (error: any) {
    console.error("❌ CRITICAL ERROR in getFarms:", error.message);
    res.status(500).json({ message: "Database error", error: error.message });
  }
};

// 3. Harvest a Crop
export const harvestFarm = async (req: Request, res: Response) => {
  try {
    const { id } = req.params; 
    const { sellingPrice, quantity, unit } = req.body; 

    const updatedFarm = await prisma.farmProfile.update({
      where: { id },
      data: { endDate: new Date(), status: 'HARVESTED' }
    });

    if (sellingPrice) {
      await prisma.yieldLog.create({
        data: {
          farmId: id,
          quantity: parseFloat(quantity) || 0,
          unit: unit || "kg",
          sellingPrice: parseFloat(sellingPrice),
          soldDate: new Date()
        }
      });
    }
    res.json(updatedFarm);
  } catch (error: any) {
    res.status(500).json({ message: "Failed to update harvest", error: error.message });
  }
};

// 4. Delete a Farm Record
export const deleteFarm = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.farmProfile.delete({ where: { id } });
    res.json({ message: "Farm record deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ message: "Failed to delete farm", error: error.message });
  }
};

// 5. Get Farm Summary Statistics
export const getFarmSummary = async (req: Request, res: Response) => {
  try {
    const rawUserId = req.params.userId || (req as any).phoneNumber;
    let targetPhone = rawUserId;
    
    if (rawUserId?.includes('-')) {
      const user = await prisma.user.findUnique({ where: { id: rawUserId }, select: { phoneNumber: true } });
      if (user) targetPhone = user.phoneNumber;
    }

    if (!targetPhone) return res.status(400).json({ message: "User Phone Number is required" });

    const activeCrops = await prisma.farmProfile.count({ 
        where: { userId: String(targetPhone), status: 'ACTIVE' } 
    });
    
    const totalAcresAggregate = await prisma.farmProfile.aggregate({
      where: { userId: String(targetPhone), status: 'ACTIVE' },
      _sum: { fieldSizeAcres: true }
    });
    
    const harvestedCrops = await prisma.farmProfile.count({ 
        where: { userId: String(targetPhone), status: 'HARVESTED' } 
    });

    res.json({
      activeCrops,
      totalAcres: totalAcresAggregate._sum.fieldSizeAcres || 0,
      harvestedCrops
    });
  } catch (error: any) {
    res.status(500).json({ message: "Failed to fetch summary", error: error.message });
  }
};

// 6. Get Crop Profit & Loss
export const getCropProfitAnalysis = async (req: Request, res: Response) => {
  try {
    const { farmId } = req.params;
    const farm = await prisma.farmProfile.findUnique({
      where: { id: farmId },
      include: { expenses: true, yields: true }
    });

    if (!farm) return res.status(404).json({ message: "Farm record not found" });

    const totalExpenses = farm.expenses.reduce((sum: number, exp: any) => sum + exp.amount, 0);
    const totalIncome = farm.yields.reduce((sum: number, yld: any) => sum + yld.sellingPrice, 0);

    res.json({
      cropName: farm.cropName,
      totalExpenses,
      totalIncome,
      profit: totalIncome - totalExpenses
    });
  } catch (error: any) {
    res.status(500).json({ message: "Error calculating report", error: error.message });
  }
};

// 7. Add Yield Income
export const addYield = async (req: Request, res: Response) => {
  try {
    const { farmId, sellingPrice, quantity, unit, soldDate } = req.body;
    
    // Ensure the farm exists
    const farm = await prisma.farmProfile.findUnique({
      where: { id: farmId }
    });

    if (!farm) {
      return res.status(404).json({ message: "Farm not found" });
    }

    const newYield = await prisma.yieldLog.create({
      data: {
        farmId,
        quantity: parseFloat(quantity) || 1,
        unit: unit || "Total Unit",
        sellingPrice: parseFloat(sellingPrice),
        soldDate: soldDate ? new Date(soldDate) : new Date()
      }
    });

    res.status(201).json(newYield);
  } catch (error: any) {
    console.error("❌ Error adding yield:", error);
    res.status(500).json({ message: "Failed to add yield", error: error.message });
  }
};

// 8. Log a Field Activity (Irrigation, Fertilizer, Pesticide, etc.)
export const addFieldActivity = async (req: Request, res: Response) => {
  try {
    const { farmId, type, productName, quantity, unit, appliedDate } = req.body;

    if (!farmId || !type || !appliedDate) {
      return res.status(400).json({ message: "farmId, type, and appliedDate are required" });
    }

    const farm = await prisma.farmProfile.findUnique({ where: { id: farmId } });
    if (!farm) {
      return res.status(404).json({ message: "Farm not found" });
    }

    const activity = await prisma.fieldActivity.create({
      data: {
        farmId,
        type,
        productName: productName || "",
        quantity: parseFloat(quantity) || 0,
        unit: unit || "L",
        appliedDate: new Date(appliedDate),
      },
    });

    console.log(`✅ Field activity logged: ${type} for farm ${farmId}`);
    res.status(201).json({ message: "Activity logged successfully", activity });
  } catch (error: any) {
    console.error("❌ Error logging field activity:", error);
    res.status(500).json({ message: "Failed to log activity", error: error.message });
  }
};

// 9. Get All Field Activities for a Farm
export const getFieldActivities = async (req: Request, res: Response) => {
  try {
    const { farmId } = req.params;

    if (!farmId) {
      return res.status(400).json({ message: "farmId is required" });
    }

    const activities = await prisma.fieldActivity.findMany({
      where: { farmId },
      orderBy: { appliedDate: "desc" },
    });

    res.json({ data: activities, count: activities.length });
  } catch (error: any) {
    console.error("❌ Error fetching activities:", error);
    res.status(500).json({ message: "Failed to fetch activities", error: error.message });
  }
};
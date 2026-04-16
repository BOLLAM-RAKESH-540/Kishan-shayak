import { Request, Response } from 'express';
import prisma from '../utils/prisma';

// ----------------------------------------------------------------------
// 1. Soil Testing Routes
// ----------------------------------------------------------------------

export const createSoilTest = async (req: Request, res: Response) => {
  try {
    const userPhone = (req as any).phoneNumber;
    const { farmId } = req.body;

    const request = await prisma.soilTestRequest.create({
      data: {
        userId: String(userPhone),
        farmId: farmId || null,
        status: "PENDING"
      }
    });

    res.status(201).json(request);
  } catch (error: any) {
    res.status(500).json({ message: "Failed to request soil test", details: error.message });
  }
};

export const getSoilTests = async (req: Request, res: Response) => {
  try {
    const userPhone = (req as any).phoneNumber;
    const tests = await prisma.soilTestRequest.findMany({
      where: { userId: String(userPhone) },
      orderBy: { createdAt: 'desc' }
    });
    res.json(tests);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch soil tests" });
  }
};

// ----------------------------------------------------------------------
// 2. Waste Utilization / Biomass Trade Routes
// ----------------------------------------------------------------------

export const createWasteListing = async (req: Request, res: Response) => {
  try {
    const userPhone = (req as any).phoneNumber;
    const { type, quantity, unit, price, description } = req.body;

    const listing = await prisma.wasteListing.create({
      data: {
        userId: String(userPhone),
        type, 
        quantity: parseFloat(quantity),
        unit,
        price: price ? parseFloat(price) : null,
        description
      }
    });

    res.status(201).json(listing);
  } catch (error: any) {
    res.status(500).json({ message: "Failed to create waste listing", details: error.message });
  }
};

export const getWasteListings = async (req: Request, res: Response) => {
  try {
    const listings = await prisma.wasteListing.findMany({
      where: { isAvailable: true },
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { name: true, location: true, phoneNumber: true } }
      }
    });
    res.json(listings);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch waste listings" });
  }
};

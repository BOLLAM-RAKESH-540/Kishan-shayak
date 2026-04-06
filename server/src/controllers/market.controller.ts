import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// 1. Get All Shops (Public View)
export const getShops = async (req: Request, res: Response) => {
  try {
    const shops = await prisma.supplierShop.findMany({
      include: {
        products: true // Show products available in each shop
      }
    });
    res.json(shops);
  } catch (error) {
    console.error("Error fetching shops:", error);
    res.status(500).json({ message: "Error fetching shops" });
  }
};

// 2. Get Specific Shop for the Logged-in User
export const getMyShop = async (req: Request, res: Response) => {
  try {
    // 🟢 Use verified phone number from token
    const userPhone = (req as any).phoneNumber || req.query.userId;

    if (!userPhone) {
      return res.status(400).json({ message: "User phone number is required" });
    }

    const shop = await prisma.supplierShop.findFirst({
      where: { ownerId: String(userPhone) },
      include: { products: true }
    });

    res.json(shop);
  } catch (error) {
    res.status(500).json({ message: "Error fetching your shop" });
  }
};

// 3. Module 5: Get Market Prices
export const getMarketPrices = async (req: Request, res: Response) => {
  // Currently mock data - will be linked to a MarketPrice table later
  res.json([
    { crop: "Paddy (Common)", price: 2183, market: "Warangal Mandi", trend: "up" },
    { crop: "Cotton", price: 7200, market: "Adilabad", trend: "down" },
    { crop: "Maize", price: 1960, market: "Nizamabad", trend: "stable" }
  ]);
};

// 4. Create a Supplier Shop (Linking via Phone Number)
export const createShop = async (req: Request, res: Response) => {
  try {
    const { name, type, address, contactNumber, ownerId } = req.body;
    
    // 🟢 ownerId must be the User's Phone Number
    const shopOwner = ownerId || (req as any).phoneNumber;

    if (!shopOwner || !name || !type) {
      return res.status(400).json({ message: "Shop name, type, and owner phone are required" });
    }

    const newShop = await prisma.supplierShop.create({
      data: {
        name,
        type,
        address,
        contactNumber,
        ownerId: String(shopOwner) // 🟢 Linked to User.phoneNumber
      }
    });

    res.status(201).json(newShop);
  } catch (error: any) {
    res.status(500).json({ message: "Failed to create shop", error: error.message });
  }
};
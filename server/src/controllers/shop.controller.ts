import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// 1. Register a Shop
export const createShop = async (req: Request, res: Response) => {
  try {
    // 🟢 Using phoneNumber from Auth Middleware (verified string)
    const userPhone = (req as any).phoneNumber; 
    const { name, type, address, contactNumber } = req.body;

    if (!userPhone || !name || !type) {
      return res.status(400).json({ error: "Shop name, type, and owner identification are required" });
    }

    const shop = await prisma.supplierShop.create({
      data: {
        ownerId: String(userPhone), // 🟢 Linked to User.phoneNumber string
        name,
        type,
        address,
        contactNumber
      }
    });

    console.log(`✅ Shop "${name}" registered for owner: ${userPhone}`);
    res.status(201).json(shop);
  } catch (error: any) {
    console.error("❌ Error creating shop:", error);
    res.status(500).json({ error: "Failed to create shop", details: error.message });
  }
};

// 2. Add Product to Shop
export const addProduct = async (req: Request, res: Response) => {
  try {
    const userPhone = (req as any).phoneNumber;
    const { shopId, name, price, unit } = req.body;
    
    // 🟢 Security Check: Ensure the person adding products actually owns this shop
    const shop = await prisma.supplierShop.findUnique({
      where: { id: shopId }
    });

    if (!shop || shop.ownerId !== userPhone) {
      return res.status(403).json({ error: "Unauthorized: You do not own this shop" });
    }

    const product = await prisma.product.create({
      data: {
        supplierShopId: shopId,
        name,
        price: parseFloat(price),
        unit
      }
    });

    res.status(201).json(product);
  } catch (error: any) {
    console.error("❌ Error adding product:", error);
    res.status(500).json({ error: "Failed to add product" });
  }
};

// 3. Get All Shops
export const getShops = async (req: Request, res: Response) => {
  try {
    const shops = await prisma.supplierShop.findMany({
      include: { 
        products: true,
        user: { select: { name: true, phoneNumber: true } } // 🟢 Include owner details
      }, 
      orderBy: { createdAt: 'desc' }
    });
    res.json(shops);
  } catch (error) {
    console.error("❌ Error fetching shops:", error);
    res.status(500).json({ error: "Failed to fetch shops" });
  }
};

// 4. Get My Shop (Helper for Shop Owner Dashboard)
export const getMyShop = async (req: Request, res: Response) => {
  try {
    const userPhone = (req as any).phoneNumber;
    
    const shop = await prisma.supplierShop.findFirst({
      where: { ownerId: String(userPhone) },
      include: { products: true }
    });

    if (!shop) return res.status(404).json({ message: "No shop found for this account" });
    
    res.json(shop);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch shop details" });
  }
};
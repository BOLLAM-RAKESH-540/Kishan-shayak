import { Request, Response } from 'express';
import prisma from '../utils/prisma';


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

// 3. Module 5: Get Market Prices (Static - enhanced data with 20 crops)
export const getMarketPrices = async (req: Request, res: Response) => {
    const today = new Date();
    // Deterministic random seed based on day, month, year so everyone gets the same "daily" prices
    const seed = today.getFullYear() * 10000 + today.getMonth() * 100 + today.getDate();
    
    // Hash function to get a pseudo-random multiplier 0.95 to 1.05
    const getMultiplier = (cropName: string) => {
      let hash = seed;
      for (let i = 0; i < cropName.length; i++) {
        hash = Math.imul(31, hash) + cropName.charCodeAt(i) | 0;
      }
      const pseudoRandom = Math.abs(Math.sin(hash));
      return 0.95 + (pseudoRandom * 0.10); // Between -5% and +5%
    };

    const basePrices = [
      { crop: "Paddy (Common)",       price: 2183,  msp: 2183,  unit: "per quintal", market: "Warangal",    state: "Telangana" },
      { crop: "Paddy (Grade A)",      price: 2203,  msp: 2203,  unit: "per quintal", market: "Nizamabad",   state: "Telangana" },
      { crop: "Cotton (Long Staple)", price: 7121,  msp: 7121,  unit: "per quintal", market: "Adilabad",    state: "Telangana" },
      { crop: "Cotton (Medium)",      price: 6620,  msp: 6620,  unit: "per quintal", market: "Khammam",     state: "Telangana" },
      { crop: "Maize",                price: 2090,  msp: 2090,  unit: "per quintal", market: "Karimnagar",  state: "Telangana" },
      { crop: "Chilli (Dry)",         price: 12800, msp: null,  unit: "per quintal", market: "Guntur",      state: "Andhra Pradesh" },
      { crop: "Turmeric",             price: 14500, msp: null,  unit: "per quintal", market: "Nizamabad",   state: "Telangana" },
      { crop: "Soybean",              price: 4600,  msp: 4600,  unit: "per quintal", market: "Nagpur",      state: "Vidarbha" },
      { crop: "Groundnut",            price: 6425,  msp: 6425,  unit: "per quintal", market: "Kurnool",     state: "Andhra Pradesh" },
      { crop: "Sunflower",            price: 6760,  msp: 6760,  unit: "per quintal", market: "Nalgonda",    state: "Telangana" },
      { crop: "Wheat",                price: 2275,  msp: 2275,  unit: "per quintal", market: "Hyderabad",   state: "Telangana" },
      { crop: "Tomato",               price: 1800,  msp: null,  unit: "per quintal", market: "Madanapalle", state: "Andhra Pradesh" },
      { crop: "Onion",                price: 1200,  msp: null,  unit: "per quintal", market: "Kurnool",     state: "Andhra Pradesh" },
      { crop: "Jowar (Hybrid)",       price: 3371,  msp: 3371,  unit: "per quintal", market: "Sangareddy",  state: "Telangana" },
      { crop: "Bajra",                price: 2625,  msp: 2625,  unit: "per quintal", market: "Nalgonda",    state: "Telangana" },
      { crop: "Moong Dal",            price: 8682,  msp: 8682,  unit: "per quintal", market: "Hyderabad",   state: "Telangana" },
      { crop: "Urad Dal",             price: 7400,  msp: 7400,  unit: "per quintal", market: "Karimnagar",  state: "Telangana" },
      { crop: "Bengal Gram",          price: 5440,  msp: 5440,  unit: "per quintal", market: "Warangal",    state: "Telangana" },
      { crop: "Sesame (Til)",         price: 8635,  msp: 8635,  unit: "per quintal", market: "Nizamabad",   state: "Telangana" },
      { crop: "Red Lentil (Masoor)",  price: 5500,  msp: 5500,  unit: "per quintal", market: "Hyderabad",   state: "Telangana" },
    ];

    const currentPrices = basePrices.map(item => {
      const multiplier = getMultiplier(item.crop);
      const isUp = multiplier > 1;
      const calculatedPrice = Math.round(item.price * multiplier);
      
      return {
        ...item,
        price: calculatedPrice,
        trend: isUp ? "up" : "down"
      };
    });

    res.json(currentPrices);
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
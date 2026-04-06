import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * 🟢 Create a new Husbandry Listing
 */
export const createHusbandryListing = async (req: Request, res: Response) => {
  try {
    const { 
      userId, 
      type, 
      price, 
      address, 
      latitude, 
      longitude,
      species, 
      breed, 
      ageMonths, 
      imageUrl,
      milkType, 
      quantityLiters 
    } = req.body;

    const userPhone = userId || (req as any).phoneNumber;

    if (!userPhone) {
      return res.status(400).json({ success: false, error: "User phone number is required" });
    }

    if (!['LIVESTOCK', 'MILK'].includes(type)) {
      return res.status(400).json({ success: false, error: "Invalid listing type." });
    }

    let expiresAt: Date | null = null;
    if (type === 'MILK') {
      expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 24);
    }

    const newListing = await prisma.husbandryListing.create({
      data: {
        userId: String(userPhone),
        type,
        price: parseFloat(price) || 0,
        address,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        isActive: true,
        species: type === 'LIVESTOCK' ? species : null,
        breed: type === 'LIVESTOCK' ? breed : null,
        ageMonths: ageMonths ? parseInt(ageMonths) : null,
        imageUrl,
        milkType: type === 'MILK' ? milkType : null,
        quantityLiters: quantityLiters ? parseFloat(quantityLiters) : null,
        expiresAt: expiresAt 
      }
    });

    return res.status(201).json({ success: true, data: newListing });
  } catch (error: any) {
    console.error("❌ Database Error:", error);
    return res.status(500).json({ success: false, error: "Failed to create listing" });
  }
};

/**
 * 🟢 Get Listings for Current User
 */
export const getMyHusbandryListings = async (req: Request, res: Response) => {
  try {
    const userPhone = (req as any).phoneNumber || req.query.userId || req.params.userId;

    if (!userPhone) {
      return res.status(400).json({ success: false, error: "Phone number required" });
    }

    const listings = await prisma.husbandryListing.findMany({
      where: { userId: String(userPhone) },
      orderBy: { createdAt: 'desc' }
    });

    return res.status(200).json({ success: true, count: listings.length, data: listings });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: "Failed to fetch listings" });
  }
};

/**
 * 🟡 Toggle Listing Status (Mark as Sold / Active)
 * Instead of deleting, this changes the 'isActive' flag
 */
export const toggleListingStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userPhone = (req as any).phoneNumber || req.query.userId;

    if (!userPhone) {
      return res.status(400).json({ success: false, error: "Authentication required" });
    }

    // 1. Find the listing to check ownership and current status
    const listing = await prisma.husbandryListing.findUnique({
      where: { id: id }
    });

    if (!listing) {
      return res.status(404).json({ success: false, error: "Listing not found" });
    }

    // 2. Ownership check
    if (listing.userId !== String(userPhone)) {
      return res.status(403).json({ success: false, error: "Unauthorized" });
    }

    // 3. Update the isActive status
    const updatedListing = await prisma.husbandryListing.update({
      where: { id: id },
      data: { isActive: !listing.isActive } // Flips true to false and vice-versa
    });

    console.log(`🔄 Status toggled for listing ${id}: Now ${updatedListing.isActive ? 'Active' : 'Sold'}`);
    return res.status(200).json({ success: true, data: updatedListing });
  } catch (error: any) {
    console.error("❌ Toggle Status Error:", error);
    return res.status(500).json({ success: false, error: "Failed to update listing status" });
  }
};

/**
 * 🔴 Delete a Listing
 */
export const deleteHusbandryListing = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userPhone = (req as any).phoneNumber || req.query.userId;

    if (!userPhone) {
      return res.status(400).json({ success: false, error: "Authentication required to delete" });
    }

    const listing = await prisma.husbandryListing.findUnique({
      where: { id: id }
    });

    if (!listing) {
      return res.status(404).json({ success: false, error: "Listing not found" });
    }

    if (listing.userId !== String(userPhone)) {
      return res.status(403).json({ success: false, error: "Unauthorized: You can only delete your own items" });
    }

    await prisma.husbandryListing.delete({
      where: { id: id }
    });

    return res.status(200).json({ success: true, message: "Listing removed successfully" });
  } catch (error: any) {
    console.error("❌ Delete Error:", error);
    return res.status(500).json({ success: false, error: "Failed to delete listing" });
  }
};
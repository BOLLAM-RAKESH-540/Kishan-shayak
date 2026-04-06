import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ✅ 1. CREATE EXPENSE
export const createExpense = async (req: Request, res: Response) => {
  try {
    const { userId, farmId, category, amount, date, note, itemName } = req.body;
    
    // Standardizing the phone number source (Frontend sends userId as phone)
    const userPhone = userId || (req as any).user?.phoneNumber || (req as any).phoneNumber;

    // Validation
    if (!userPhone || amount === undefined || !date || !category) {
      return res.status(400).json({ error: "Missing required fields (User Phone, amount, date, category)" });
    }

    // Create entry in Database
    const newExpense = await prisma.expense.create({
      data: {
        userId: String(userPhone), 
        // 🟢 Robust farmId check: ensures we don't send "" or "undefined" strings to the DB
        farmId: (farmId && farmId.length > 10) ? farmId : null, 
        category: category,
        // 🟢 Fallback logic for itemName so your list never looks empty
        itemName: itemName || note || category, 
        amount: parseFloat(String(amount)), 
        date: new Date(date),       
        note: note || ""
      },
      // Include farm details so the frontend can immediately show the Crop Name
      include: {
        farm: {
          select: { cropName: true }
        }
      }
    });

    console.log(`✅ Expense Saved: ₹${amount} for ${newExpense.itemName} (${userPhone})`);
    return res.status(201).json({ success: true, data: newExpense });

  } catch (error: any) {
    console.error("❌ Error creating expense:", error);
    return res.status(500).json({ error: "Failed to save expense", details: error.message });
  }
};

// ✅ 2. GET EXPENSES (For a specific user)
export const getExpenses = async (req: Request, res: Response) => {
  try {
    const userPhone = (req as any).user?.phoneNumber || (req as any).phoneNumber || req.query.userId || req.body.userId;
    const farmId = req.query.farmId as string;

    if (!userPhone) {
      return res.status(400).json({ error: "User Phone Number is required" });
    }

    const expenses = await prisma.expense.findMany({
      where: {
        userId: String(userPhone),
        // Allows filtering by a specific crop if farmId is provided
        ...(farmId && farmId !== "all" && farmId !== "" ? { farmId: farmId } : {}) 
      },
      include: {
        farm: {
          select: {
            cropName: true,
            status: true
          }
        }
      },
      orderBy: {
        date: 'desc' 
      }
    });

    return res.status(200).json(expenses);

  } catch (error) {
    console.error("❌ Error fetching expenses:", error);
    return res.status(500).json({ error: "Failed to fetch expenses" });
  }
};
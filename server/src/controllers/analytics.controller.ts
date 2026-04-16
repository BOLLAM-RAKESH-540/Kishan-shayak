import { Request, Response } from 'express';
import prisma from '../utils/prisma';


/**
 * 📊 Financial Analytics Controller
 * Purpose: Aggregate income vs expenses and calculate ROI for different crops.
 */
export const getFinancialSummary = async (req: Request, res: Response) => {
  try {
    const userPhone = (req as any).phoneNumber || req.query.userId;
    if (!userPhone) return res.status(400).json({ message: "User phone is required" });

    // 1. Fetch All Raw Data
    const [expenses, farms, vehicleWork] = await Promise.all([
      prisma.expense.findMany({ where: { userId: String(userPhone) } }),
      prisma.farmProfile.findMany({ 
        where: { userId: String(userPhone) },
        include: { yields: true }
      }),
      prisma.vehicleWork.findMany({ where: { userId: String(userPhone), isPaid: true } })
    ]);

    // 2. Aggregate Totals
    const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
    const totalYieldIncome = farms.reduce((sum, f) => 
      sum + f.yields.reduce((ysk, y) => ysk + y.sellingPrice, 0), 0
    );
    const totalMachineryIncome = vehicleWork.reduce((sum, v) => sum + v.amount, 0);
    const totalIncome = totalYieldIncome + totalMachineryIncome;
    const netProfit = totalIncome - totalExpenses;

    // 3. Category Breakdown (for Pie Chart)
    const categories: Record<string, number> = {};
    expenses.forEach(e => {
       categories[e.category] = (categories[e.category] || 0) + e.amount;
    });

    // 4. Crop Performance (ROI Analysis)
    const cropPerformance = farms.map(farm => {
       const cropExpenses = expenses.filter(e => e.farmId === farm.id).reduce((sum, e) => sum + e.amount, 0);
       const cropIncome = farm.yields.reduce((sum, y) => sum + y.sellingPrice, 0);
       const profit = cropIncome - cropExpenses;
       const roi = cropExpenses > 0 ? (profit / cropExpenses) * 100 : 0;

       return {
         id: farm.id,
         name: farm.cropName,
         status: farm.status,
         income: cropIncome,
         expense: cropExpenses,
         profit,
         roi: Math.round(roi),
         acres: farm.fieldSizeAcres
       };
    });

    // 5. Monthly Trends (last 6 months)
    // Simplified for now - can be expanded to full date grouping
    
    res.json({
      summary: {
        totalIncome,
        totalExpenses,
        netProfit,
        roi: totalExpenses > 0 ? Math.round((netProfit / totalExpenses) * 100) : 0,
      },
      categories: Object.entries(categories).map(([name, value]) => ({ name, value })),
      cropPerformance,
      machineryIncome: totalMachineryIncome
    });

  } catch (error: any) {
    console.error("Analytics Error:", error);
    res.status(500).json({ message: "Failed to generate financial report" });
  }
};

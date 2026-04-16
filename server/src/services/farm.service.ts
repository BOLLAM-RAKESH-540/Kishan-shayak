import prisma from "../utils/prisma";
import { CustomError } from "../middlewares/error.middleware";

export class FarmService {
  /**
   * Helper to resolve a valid Phone Number from either a UUID or a Phone String.
   * This ensures consistency because the DB schema uses phoneNumber as the foreign key.
   */
  static async resolvePhoneNumber(identifier: string): Promise<string> {
    if (!identifier) {
      throw new CustomError("User identification is required", 400);
    }

    if (identifier.includes("-")) {
      const user = await prisma.user.findUnique({
        where: { id: identifier },
        select: { phoneNumber: true },
      });
      if (!user) {
        throw new CustomError("User not found with provided ID", 404);
      }
      return user.phoneNumber;
    }

    return identifier;
  }

  /**
   * Add a new farm record
   */
  static async addFarm(userId: string, data: any) {
    const targetPhone = await this.resolvePhoneNumber(userId);
    const { cropName, fieldSizeAcres, startDate, endDate } = data;

    if (!cropName || !fieldSizeAcres || !startDate) {
      throw new CustomError("Missing required fields", 400);
    }

    const status = endDate ? "HARVESTED" : "ACTIVE";

    return await prisma.farmProfile.create({
      data: {
        userId: String(targetPhone),
        cropName,
        fieldSizeAcres: parseFloat(fieldSizeAcres),
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        status: status,
      },
    });
  }

  /**
   * Get all farms for a specific user with pagination
   */
  static async getFarms(userId: string, query: any) {
    const targetPhone = await this.resolvePhoneNumber(userId);
    const { page = "1", limit = "10" } = query;
    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);

    const [farms, totalFarms] = await Promise.all([
      prisma.farmProfile.findMany({
        where: { userId: String(targetPhone) },
        include: {
          expenses: true,
          yields: true,
          activities: { orderBy: { appliedDate: "desc" } },
        },
        orderBy: { startDate: "desc" },
        skip,
        take,
      }),
      prisma.farmProfile.count({
        where: { userId: String(targetPhone) },
      }),
    ]);

    return {
      farms,
      metadata: {
        totalFarms,
        currentPage: Number(page),
        totalPages: Math.ceil(totalFarms / Number(limit)),
        hasMore: skip + take < totalFarms,
      },
    };
  }

  /**
   * Log harvest and record yield
   */
  static async harvestFarm(farmId: string, data: any) {
    const { sellingPrice, quantity, unit } = data;

    const updatedFarm = await prisma.farmProfile.update({
      where: { id: farmId },
      data: { endDate: new Date(), status: "HARVESTED" },
    });

    if (sellingPrice) {
      await prisma.yieldLog.create({
        data: {
          farmId,
          quantity: parseFloat(quantity) || 0,
          unit: unit || "kg",
          sellingPrice: parseFloat(sellingPrice),
          soldDate: new Date(),
        },
      });
    }

    return updatedFarm;
  }

  /**
   * Get Farm Summary Statistics for a User
   */
  static async getFarmSummary(userId: string) {
    const targetPhone = await this.resolvePhoneNumber(userId);

    const [
      activeCrops,
      totalAcresAggregate,
      harvestedCrops,
      totalExpensesAggregate,
      communityPosts,
      communityInteractions,
    ] = await Promise.all([
      prisma.farmProfile.count({ where: { userId: String(targetPhone), status: "ACTIVE" } }),
      prisma.farmProfile.aggregate({
        where: { userId: String(targetPhone), status: "ACTIVE" },
        _sum: { fieldSizeAcres: true },
      }),
      prisma.farmProfile.count({ where: { userId: String(targetPhone), status: "HARVESTED" } }),
      prisma.expense.aggregate({
        where: { userId: String(targetPhone) },
        _sum: { amount: true },
      }),
      prisma.communityPost.count({ where: { userId: String(targetPhone) } }),
      prisma.communityComment.count({ where: { userId: String(targetPhone) } }),
    ]);

    return {
      activeCrops,
      totalAcres: totalAcresAggregate._sum.fieldSizeAcres || 0,
      harvestedCrops,
      totalExpenses: totalExpensesAggregate._sum.amount || 0,
      communityPosts,
      communityInteractions,
    };
  }

  /**
   * Calculate P&L for a specific farm
   */
  static async getProfitAnalysis(farmId: string) {
    const farm = await prisma.farmProfile.findUnique({
      where: { id: farmId },
      include: { expenses: true, yields: true },
    });

    if (!farm) {
      throw new CustomError("Farm record not found", 404);
    }

    const totalExpenses = farm.expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const totalIncome = farm.yields.reduce((sum, yld) => sum + yld.sellingPrice, 0);

    return {
      cropName: farm.cropName,
      totalExpenses,
      totalIncome,
      profit: totalIncome - totalExpenses,
    };
  }

  /**
   * Add a field activity
   */
  static async addActivity(data: any) {
    const { farmId, type, productName, quantity, unit, appliedDate } = data;

    if (!farmId || !type || !appliedDate) {
      throw new CustomError("farmId, type, and appliedDate are required", 400);
    }

    return await prisma.fieldActivity.create({
      data: {
        farmId,
        type,
        productName: productName || "",
        quantity: parseFloat(quantity) || 0,
        unit: unit || "L",
        appliedDate: new Date(appliedDate),
      },
    });
  }
}

import { Request, Response, NextFunction } from 'express';
import { FarmService } from '../services/farm.service';
import prisma from '../utils/prisma';

export const addFarm = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.body.userId || (req as any).phoneNumber;
    const farm = await FarmService.addFarm(userId, req.body);
    res.status(201).json(farm);
  } catch (error) {
    next(error);
  }
};

export const getFarms = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.params.userId || (req as any).phoneNumber;
    const result = await FarmService.getFarms(userId, req.query);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const harvestFarm = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const farm = await FarmService.harvestFarm(req.params.id, req.body);
    res.json(farm);
  } catch (error) {
    next(error);
  }
};

export const deleteFarm = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await prisma.farmProfile.delete({ where: { id: req.params.id } });
    res.json({ message: "Farm record deleted successfully" });
  } catch (error) {
    next(error);
  }
};

export const getFarmSummary = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.params.userId || (req as any).phoneNumber;
    const summary = await FarmService.getFarmSummary(userId);
    res.json(summary);
  } catch (error) {
    next(error);
  }
};

export const getCropProfitAnalysis = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const report = await FarmService.getProfitAnalysis(req.params.farmId);
    res.json(report);
  } catch (error) {
    next(error);
  }
};

export const addYield = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { farmId, sellingPrice, quantity, unit, soldDate } = req.body;
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
  } catch (error) {
    next(error);
  }
};

export const addFieldActivity = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const activity = await FarmService.addActivity(req.body);
    res.status(201).json({ message: "Activity logged successfully", activity });
  } catch (error) {
    next(error);
  }
};

export const getFieldActivities = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const activities = await prisma.fieldActivity.findMany({
      where: { farmId: req.params.farmId },
      orderBy: { appliedDate: "desc" },
    });
    res.json({ data: activities, count: activities.length });
  } catch (error) {
    next(error);
  }
};

export const updateFarm = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userPhone = (req as any).phoneNumber;
    const { cropName, fieldSizeAcres, startDate, endDate } = req.body;

    const updated = await prisma.farmProfile.update({
      where: { id },
      data: {
        ...(cropName && { cropName }),
        ...(fieldSizeAcres && { fieldSizeAcres: parseFloat(fieldSizeAcres) }),
        ...(startDate && { startDate: new Date(startDate) }),
        ...(endDate !== undefined && { endDate: endDate ? new Date(endDate) : null }),
      },
    });

    res.json(updated);
  } catch (error) {
    next(error);
  }
};
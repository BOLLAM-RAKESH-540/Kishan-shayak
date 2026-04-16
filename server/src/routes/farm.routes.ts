import { Router } from 'express';
import {
  addFarm,
  getFarms,
  harvestFarm,
  deleteFarm,
  getFarmSummary,
  getCropProfitAnalysis,
  addYield,
  addFieldActivity,
  getFieldActivities,
  updateFarm,
} from '../controllers/farm.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

// ✅ IMPORTANT: Specific named paths MUST come before wildcard params

// POST  /api/farms/add — Protected: must be logged in
router.post('/add', authMiddleware, addFarm);

// GET   /api/farms/summary/:userId — Protected
router.get('/summary/:userId', authMiddleware, getFarmSummary);

// GET   /api/farms/profit/:farmId — Protected
router.get('/profit/:farmId', authMiddleware, getCropProfitAnalysis);

// POST  /api/farms/yield/add — Protected
router.post('/yield/add', authMiddleware, addYield);

// POST  /api/farms/activity/add — Protected
router.post('/activity/add', authMiddleware, addFieldActivity);

// GET   /api/farms/activities/:farmId — Protected
router.get('/activities/:farmId', authMiddleware, getFieldActivities);

// PATCH /api/farms/harvest/:id — Protected
router.patch('/harvest/:id', authMiddleware, harvestFarm);

// PATCH /api/farms/edit/:id — Protected (new: edit farm details)
router.patch('/edit/:id', authMiddleware, updateFarm);

// GET   /api/farms/:userId — Protected (wildcard must be AFTER named routes)
router.get('/:userId', authMiddleware, getFarms);

// DELETE /api/farms/:id — Protected
router.delete('/:id', authMiddleware, deleteFarm);

export default router;
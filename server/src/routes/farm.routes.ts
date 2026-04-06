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
  getFieldActivities
} from '../controllers/farm.controller';

const router = Router();

// ✅ IMPORTANT: Specific named paths MUST come before wildcard params
// Otherwise Express matches /:userId before /summary/:userId

// POST  /api/farms/add
router.post('/add', addFarm);

// GET   /api/farms/summary/:userId
router.get('/summary/:userId', getFarmSummary);

// GET   /api/farms/profit/:farmId
router.get('/profit/:farmId', getCropProfitAnalysis);

// POST  /api/farms/yield/add
router.post('/yield/add', addYield);

// POST  /api/farms/activity/add  ← must be before wildcards
router.post('/activity/add', addFieldActivity);

// GET   /api/farms/activities/:farmId
router.get('/activities/:farmId', getFieldActivities);

// PATCH /api/farms/harvest/:id
router.patch('/harvest/:id', harvestFarm);

// GET   /api/farms/:userId  ← wildcard, must be AFTER all named routes
router.get('/:userId', getFarms);

// DELETE /api/farms/:id  ← wildcard
router.delete('/:id', deleteFarm);

export default router;
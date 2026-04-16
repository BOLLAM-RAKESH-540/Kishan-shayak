import { Router } from 'express';
import { getFinancialSummary } from '../controllers/analytics.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

// Analytics requires authentication — uses req.phoneNumber from middleware
router.get('/summary', authMiddleware, getFinancialSummary);

export default router;

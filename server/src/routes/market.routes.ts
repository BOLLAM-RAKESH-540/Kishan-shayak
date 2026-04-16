import { Router } from 'express';
import { getShops, getMarketPrices } from '../controllers/market.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.get('/shops', authMiddleware, getShops);
router.get('/prices', authMiddleware, getMarketPrices);

export default router;
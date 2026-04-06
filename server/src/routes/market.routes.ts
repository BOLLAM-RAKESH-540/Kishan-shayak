import { Router } from 'express';
import { getShops, getMarketPrices } from '../controllers/market.controller';

const router = Router();

router.get('/shops', getShops);
router.get('/prices', getMarketPrices);

export default router;
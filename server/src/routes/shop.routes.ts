import { Router } from "express";
import { createShop, addProduct, getShops } from "../controllers/shop.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.post("/create", authMiddleware, createShop);
router.post("/add-product", authMiddleware, addProduct);
router.get("/list", authMiddleware, getShops);

export default router;
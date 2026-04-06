import { Router } from "express";
import { addVehicleWork, getVehicleWorks } from "../controllers/vehicle.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

// Both routes need the user to be logged in (authMiddleware)
router.post("/add", authMiddleware, addVehicleWork);
router.get("/list", authMiddleware, getVehicleWorks);

export default router;
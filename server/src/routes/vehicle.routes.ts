import { Router } from "express";
import { addVehicleWork, getVehicleWorks, markPaid, deleteVehicleWork } from "../controllers/vehicle.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.post("/add", authMiddleware, addVehicleWork);
router.get("/list", authMiddleware, getVehicleWorks);
router.patch("/pay/:id", authMiddleware, markPaid);
router.delete("/:id", authMiddleware, deleteVehicleWork);

export default router;
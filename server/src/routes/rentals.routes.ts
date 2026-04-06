import { Router } from "express";
// 1. Import the deleteRental controller (we will create this next)
import { createRental, getAllRentals, deleteRental } from "../controllers/rentals.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

// Endpoint: POST /api/rentals/add (Protected)
router.post("/add", authMiddleware, createRental);

// Endpoint: GET /api/rentals/all (Public or Protected)
router.get("/all", getAllRentals);

// Endpoint: DELETE /api/rentals/:id (Protected)
// 2. Add this line to handle the delete request
router.delete("/:id", authMiddleware, deleteRental);

export default router;
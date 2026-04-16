import express from 'express';
import { createExpense, getExpenses, deleteExpense } from '../controllers/expenses.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = express.Router();

// All expense routes require authentication
router.post('/', authMiddleware, createExpense);
router.get('/', authMiddleware, getExpenses);
router.delete('/:id', authMiddleware, deleteExpense);

export default router;
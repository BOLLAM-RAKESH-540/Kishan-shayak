import express from 'express';
// 🟢 FIXED: Pointing to the correct filename 'expenses.controller'
import { createExpense, getExpenses } from '../controllers/expenses.controller';

const router = express.Router();

// Matches: axios.post('http://localhost:3000/api/expenses', ...)
router.post('/', createExpense); 

// Matches: axios.get('http://localhost:3000/api/expenses', ...)
router.get('/', getExpenses);

export default router;
import { Router } from 'express';
import { chat } from '../controllers/chatbot.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.post('/chat', authMiddleware, chat);

export default router;

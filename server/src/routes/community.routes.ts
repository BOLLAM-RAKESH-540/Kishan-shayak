import { Router } from 'express';
import * as communityController from '../controllers/community.controller';
import { upload } from '../config/multer';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

// Feed is public-facing but benefits from auth to show 'isLiked' status
router.get('/posts', authMiddleware, communityController.getFeed);
router.get('/posts/:postId/comments', authMiddleware, communityController.getComments);

// Actions require authentication
router.post('/posts', authMiddleware, upload.single('image'), communityController.createPost);
router.post('/posts/:postId/like', authMiddleware, communityController.toggleLike);
router.post('/posts/:postId/comments', authMiddleware, communityController.addComment);

export default router;

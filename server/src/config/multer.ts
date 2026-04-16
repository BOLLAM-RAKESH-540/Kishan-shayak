import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { Request } from 'express';

// Targets and their directories
const UPLOAD_TARGETS = {
  profile: 'uploads/profile-pictures',
  community: 'uploads/community-posts'
};

// Ensure all directories exist
Object.values(UPLOAD_TARGETS).forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

const storage = multer.diskStorage({
  destination: (req: Request, _file: Express.Multer.File, cb) => {
    // Determine target from request body or header (default to community for general feed)
    const target = req.body.uploadType === 'profile' ? UPLOAD_TARGETS.profile : UPLOAD_TARGETS.community;
    cb(null, target);
  },
  filename: (req: Request, file: Express.Multer.File, cb) => {
    const identifier = (req as any).userId || (req as any).id || (req as any).phoneNumber || 'generic';
    const type = req.body.uploadType || 'post';
    const ext = path.extname(file.originalname);
    cb(null, `${type}-${identifier}-${Date.now()}${ext}`);
  },
});

const fileFilter = (_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'));
  }
};

export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Increased to 5MB for high-quality crop photos
  fileFilter,
});

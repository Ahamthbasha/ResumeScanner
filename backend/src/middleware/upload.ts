import multer from 'multer';
import path from 'path';
import fs from 'fs';
import AppError from '../utils/appError';

const memoryStorage = multer.memoryStorage();

const diskStorage = multer.diskStorage({
  destination: (_, __, cb) => {
    const uploadDir = process.env.UPLOAD_DIR || 'uploads';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (_, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, 'resume-' + uniqueSuffix + ext);
  },
});

const fileFilter = (_: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new AppError('Only PDF files are allowed', 400) as any, false);
  }
};

export const upload = multer({
  storage: memoryStorage,
  fileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE || '5242880'),
  },
});

export const uploadAndSave = multer({
  storage: diskStorage,
  fileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE || '5242880'),
  },
});

export default upload;
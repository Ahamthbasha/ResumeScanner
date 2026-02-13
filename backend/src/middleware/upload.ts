import multer from 'multer';
import path from 'path';
import fs from 'fs';
import AppError from '../utils/appError';

// 1. MemoryStorage for processing (buffer access)
const memoryStorage = multer.memoryStorage();

// 2. DiskStorage for persistence (optional - if you want to save files)
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

// File filter - only PDF
const fileFilter = (_: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new AppError('Only PDF files are allowed', 400) as any, false);
  }
};

// ✅ RECOMMENDED: Use MemoryStorage for your use case
export const upload = multer({
  storage: memoryStorage, // Use memoryStorage for buffer access
  fileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE || '5242880'), // 5MB
  },
});

// Optional: If you need to save files permanently
export const uploadAndSave = multer({
  storage: diskStorage,
  fileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE || '5242880'),
  },
});

export default upload;








// import multer, { FileFilterCallback } from 'multer';
// import { Request } from 'express';
// import path from 'path';
// import AppError from '../utils/appError';

// const storage = multer.diskStorage({
//   destination: (_req: Request, _file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
//     cb(null, 'uploads/');
//   },
//   filename: (_req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//     cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
//   }
// });

// const fileFilter = (_req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
//   const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
  
//   if (allowedTypes.includes(file.mimetype)) {
//     cb(null, true);
//   } else {
//     cb(new AppError('Invalid file type. Only PDF and DOC files are allowed.', 400));
//   }
// };

// const upload = multer({
//   storage: storage,
//   fileFilter: fileFilter,
//   limits: {
//     fileSize: 5 * 1024 * 1024 // 5MB limit
//   }
// });

// export default upload;
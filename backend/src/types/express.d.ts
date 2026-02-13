import 'express';
import { File } from 'multer';

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        email: string;
        role: string;
      };
      file?: File;
      files?: File[];
    }
  }
}
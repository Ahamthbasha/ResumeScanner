// import 'express';
// import { File } from 'multer';

// declare global {
//   namespace Express {
//     interface Request {
//       user?: {
//         userId: string;
//         email: string;
//         role: string;
//       };
//       file?: File;
//       files?: File[];
//     }
//   }
// }












import 'express';

declare module 'express' {
  export interface Request {
    user?: {
      userId: string;
      email: string;
      role: string;
    };
    cookies?: any;
  }
}

declare global {
  namespace Express {
    namespace Multer {
      interface File {
        fieldname: string;
        originalname: string;
        encoding: string;
        mimetype: string;
        size: number;
        destination: string;
        filename: string;
        path: string;
        buffer: Buffer;
      }
    }
  }
}
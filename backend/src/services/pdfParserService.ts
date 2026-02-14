
import pdfParse from 'pdf-parse';

import AppError from "../utils/appError";

export class PDFParserService {

  async extractTextFromPDF(buffer: Buffer): Promise<string> {
    try {

      const data = await pdfParse(buffer);

      return data.text;
    } catch (error) {
      console.error("PDF parsing error:", error);
      throw new AppError("Failed to parse PDF file. Please ensure it's a valid PDF.", 400);
    }
  }

  async parsePDF(file: Express.Multer.File): Promise<{
    text: string;
    fileName: string;
    fileSize: number;
    pageCount?: number;
  }> {
    try {

      if (!file.buffer) {
        throw new AppError("No file buffer available. Make sure you are using memoryStorage.", 400);
      }

      const data = await pdfParse(file.buffer);

      return {
        text: data.text,
        fileName: file.originalname,
        fileSize: file.size,
        pageCount: data.numpages,
      };
    } catch (error: unknown) {
      console.error("PDF parsing error:", error);
      throw new AppError("Failed to parse PDF file. Please ensure it's a valid PDF.", 400);
    }
  }
}

import pdfParse from 'pdf-parse';

import AppError from "../utils/appError";

export class PDFParserService {

  async extractTextFromPDF(buffer: Buffer): Promise<string> {
    try {
      console.log("📄 Starting PDF parsing...");
      console.log(`📊 Buffer size: ${buffer.length} bytes`);

      const data = await pdfParse(buffer);

      console.log(`✅ PDF parsed successfully!`);
      console.log(`📄 Pages: ${data.numpages}`);
      console.log(`📝 Text length: ${data.text.length} characters`);

      return data.text;
    } catch (error) {
      console.error("❌ PDF parsing error:", error);
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
      console.log(`📄 Processing file: ${file.originalname}`);
      console.log(`📊 File size: ${file.size} bytes`);
      console.log(`🔍 Buffer available: ${!!file.buffer}`);

      if (!file.buffer) {
        throw new AppError("No file buffer available. Make sure you are using memoryStorage.", 400);
      }

      const data = await pdfParse(file.buffer);

      console.log("✅ PDF parsed successfully!");
      console.log(`📄 Pages: ${data.numpages}`);
      console.log(`📝 Text length: ${data.text.length} characters`);

      return {
        text: data.text,
        fileName: file.originalname,
        fileSize: file.size,
        pageCount: data.numpages,
      };
    } catch (error: unknown) {
      console.error("❌ PDF parsing error:", error);
      throw new AppError("Failed to parse PDF file. Please ensure it's a valid PDF.", 400);
    }
  }
}
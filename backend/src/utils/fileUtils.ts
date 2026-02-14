

import fs from "fs";
import path from "path";

export class FileUtils {

  static ensureDirectoryExists(dirPath: string): void {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  }

  static deleteFile(filePath: string): void {
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (error) {
      console.error("Error deleting file:", error);
    }
  }

  static readFileContent(filePath: string): string {
    try {
      return fs.readFileSync(filePath, "utf-8");
    } catch (error) {
      console.error("Error reading file:", error);
      return "";
    }
  }

  static getFileExtension(fileName: string): string {
    return path.extname(fileName).toLowerCase();
  }
}

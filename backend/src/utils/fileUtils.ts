/**
 * File Utility
 * Utility functions for file operations
 */

import fs from "fs";
import path from "path";

export class FileUtils {
  /**
   * Ensure directory exists
   */
  static ensureDirectoryExists(dirPath: string): void {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  }

  /**
   * Delete file
   */
  static deleteFile(filePath: string): void {
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (error) {
      console.error("Error deleting file:", error);
    }
  }

  /**
   * Read file content
   */
  static readFileContent(filePath: string): string {
    try {
      return fs.readFileSync(filePath, "utf-8");
    } catch (error) {
      console.error("Error reading file:", error);
      return "";
    }
  }

  /**
   * Get file extension
   */
  static getFileExtension(fileName: string): string {
    return path.extname(fileName).toLowerCase();
  }
}

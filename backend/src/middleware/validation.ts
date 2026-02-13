/**
 * Validation Middleware
 * Validates incoming requests
 */

import { Request, Response, NextFunction } from "express";

/**
 * Validate file upload
 */
export const validateFileMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  if (!req.file) {
    res.status(400).json({
      success: false,
      error: "No file provided",
    });
    return;
  }

  // Add additional validation logic here
  next();
};

/**
 * Validate request body
 */
export const validateRequestBody = (
  _req: Request,
  _res: Response,
  next: NextFunction,
): void => {
  // Add request body validation logic
  next();
};

/**
 * Validate ID parameter
 */
export const validateIdParam = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const { id } = req.params;
  if (!id || isNaN(Number(id))) {
    res.status(400).json({
      success: false,
      error: "Invalid ID parameter",
    });
    return;
  }
  next();
};

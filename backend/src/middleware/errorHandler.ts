/**
 * Error Handling Middleware
 * Central error handling for the application
 */

import { Request, Response, NextFunction } from "express";
import { IError, IApiResponse } from "../types";

export const errorHandler = (
  err: IError,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  console.error("Error:", err);

  const status = err.status || 500;
  const message = err.message || "Internal Server Error";

  res.status(status).json({
    success: false,
    error: message,
  } as IApiResponse<null>);
};

/**
 * 404 Not Found Middleware
 */
export const notFoundHandler = (_req: Request, res: Response): void => {
  res.status(404).json({
    success: false,
    error: "Route not found",
  } as IApiResponse<null>);
};

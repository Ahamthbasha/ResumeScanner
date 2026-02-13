// src/middleware/authMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '../services/jwtService'
import User from '../models/userModel'
import AppError from '../utils/appError';

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    email: string;
    role: string;
  };
}

export class AuthMiddleware {
  // Fixed admin ID - must match the one in AdminAuthService
  private readonly ADMIN_ID = '00000000-0000-0000-0000-000000000000';

  constructor(private jwtService: JwtService) {}

  authenticate = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Try both user and admin cookies
      const accessToken = req.cookies?.accessToken || req.cookies?.adminAccessToken;
      const refreshToken = req.cookies?.refreshToken || req.cookies?.adminRefreshToken;

      // No tokens at all
      if (!accessToken && !refreshToken) {
        throw new AppError('No authentication tokens provided', 401);
      }

      // Try access token first
      if (accessToken) {
        try {
          const payload = this.jwtService.verifyAccessToken(accessToken);
          
          // ✅ FIX: Check if it's admin - skip database lookup for admin
          if (payload.role === 'admin' && payload.userId === this.ADMIN_ID) {
            req.user = {
              userId: payload.userId,
              email: payload.email,
              role: payload.role,
            };
            return next();
          }
          
          // For regular users, check database
          const user = await User.findByPk(payload.userId);
          
          if (!user || !user.isActive) {
            throw new AppError('User not found or inactive', 401);
          }

          req.user = {
            userId: payload.userId,
            email: payload.email,
            role: payload.role,
          };
          
          return next();
        } catch (accessTokenError) {
          // Access token invalid - continue to refresh token
          console.log('Access token invalid, trying refresh token...');
        }
      }

      // Try refresh token
      if (refreshToken) {
        try {
          const refreshPayload = this.jwtService.verifyRefreshToken(refreshToken);
          
          // ✅ FIX: Check if it's admin - skip database lookup for admin
          if (refreshPayload.role === 'admin' && refreshPayload.userId === this.ADMIN_ID) {
            // Generate new access token
            const newAccessToken = this.jwtService.generateAccessToken({
              userId: refreshPayload.userId,
              email: refreshPayload.email,
              role: refreshPayload.role,
            });

            // Set new admin access token cookie
            res.cookie('adminAccessToken', newAccessToken, {
              httpOnly: true,
              secure: process.env.NODE_ENV === 'production',
              sameSite: 'strict',
              maxAge: 15 * 60 * 1000, // 15 minutes
            });

            req.user = {
              userId: refreshPayload.userId,
              email: refreshPayload.email,
              role: refreshPayload.role,
            };

            return next();
          }
          
          // For regular users, check database
          const user = await User.findByPk(refreshPayload.userId);
          
          if (!user || !user.isActive) {
            res.clearCookie('refreshToken');
            res.clearCookie('accessToken');
            res.clearCookie('adminRefreshToken');
            res.clearCookie('adminAccessToken');
            throw new AppError('User not found or inactive', 401);
          }

          // Generate new access token
          const newAccessToken = this.jwtService.generateAccessToken({
            userId: user.id,
            email: user.email,
            role: user.role,
          });

          // Set new access token cookie
          res.cookie('accessToken', newAccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 15 * 60 * 1000, // 15 minutes
          });

          req.user = {
            userId: user.id,
            email: user.email,
            role: user.role,
          };

          return next();
        } catch (refreshTokenError) {
          res.clearCookie('refreshToken');
          res.clearCookie('accessToken');
          res.clearCookie('adminRefreshToken');
          res.clearCookie('adminAccessToken');
          throw new AppError('Session expired. Please login again.', 401);
        }
      }

      throw new AppError('Authentication required', 401);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Check if user is ADMIN - based on token role
   */
  isAdmin = (req: AuthRequest, _res: Response, next: NextFunction): void => {
    try {
      if (!req.user) {
        throw new AppError('User not authenticated', 401);
      }

      if (req.user.role !== 'admin') {
        throw new AppError('Access denied. Admin privileges required.', 403);
      }

      // Optional: Verify it's the system admin
      if (req.user.userId !== this.ADMIN_ID) {
        throw new AppError('Access denied. Invalid admin credentials.', 403);
      }

      next();
    } catch (error) {
      next(error);
    }
  };

  /**
   * Check if user is REGULAR USER - based on token role
   */
  isUser = (req: AuthRequest, _res: Response, next: NextFunction): void => {
    try {
      if (!req.user) {
        throw new AppError('User not authenticated', 401);
      }

      if (req.user.role !== 'user') {
        throw new AppError('Access denied. User privileges required.', 403);
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}

export default AuthMiddleware;
// src/controllers/adminController/adminAuthController.ts
import { Request, Response, NextFunction } from 'express';
import AdminAuthService from '../../services/adminAuthService';

export class AdminAuthController {
  constructor(private adminAuthService: AdminAuthService) {}

  /**
   * Admin Login
   * POST /api/v1/admin/login
   */
  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email, password } = req.body;

      const result = await this.adminAuthService.login({ email, password });

      // ✅ FIX: Set admin-specific cookies (not the same as user cookies)
      res.cookie('adminAccessToken', result.tokens.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 15 * 60 * 1000, // 15 minutes
      });

      res.cookie('adminRefreshToken', result.tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      res.status(200).json({
        success: true,
        message: 'Admin login successful',
        data: {
          admin: result.admin,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Admin Logout
   * POST /api/v1/admin/logout
   */
  logout = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Clear admin cookies
      res.clearCookie('adminAccessToken');
      res.clearCookie('adminRefreshToken');

      res.status(200).json({
        success: true,
        message: 'Admin logout successful',
      });
    } catch (error) {
      next(error);
    }
  };
}

export default AdminAuthController;
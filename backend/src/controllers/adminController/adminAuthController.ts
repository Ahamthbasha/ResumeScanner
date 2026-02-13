// src/controllers/adminController/adminAuthController.ts
import { Request, Response, NextFunction } from 'express';
import AdminAuthService from '../../services/adminAuthService';

// Helper function for consistent cookie options
const getCookieOptions = (maxAge: number) => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: (process.env.NODE_ENV === 'production' ? 'none' : 'strict') as 'none' | 'strict',
  maxAge,
});

export class AdminAuthController {
  constructor(private adminAuthService: AdminAuthService) {}

  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email, password } = req.body;

      const result = await this.adminAuthService.login({ email, password });

      // ✅ FIX: Set admin-specific cookies with proper sameSite for production
      res.cookie('adminAccessToken', result.tokens.accessToken, getCookieOptions(15 * 60 * 1000)); // 15 minutes
      res.cookie('adminRefreshToken', result.tokens.refreshToken, getCookieOptions(7 * 24 * 60 * 60 * 1000)); // 7 days

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
      // ✅ FIX: Clear admin cookies with proper options
      const clearOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: (process.env.NODE_ENV === 'production' ? 'none' : 'strict') as 'none' | 'strict',
      };

      res.clearCookie('adminAccessToken', clearOptions);
      res.clearCookie('adminRefreshToken', clearOptions);

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
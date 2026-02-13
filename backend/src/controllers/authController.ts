import { Request, Response, NextFunction } from 'express';
import AppError from '../utils/appError'; 
import { AuthRequest } from '../middleware/authMiddleware'; 
import AuthService from '../services/authService';

export class AuthController {
  constructor(private authService: AuthService) {}

  register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { name, email, password } = req.body;

      const result = await this.authService.initiateRegistration({ name, email, password });

      // Set registration token in HTTP-only cookie
      res.cookie('registrationToken', result.registrationToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 10 * 60 * 1000, // 10 minutes
      });

      res.status(200).json({
        success: true,
        message: 'Registration initiated. Please check your email for OTP.',
        data: {
          email: result.email,
          expiresIn: result.expiresIn,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * STEP 2: Verify OTP and complete registration
   */
  verifyOTP = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email, otp } = req.body;
      const registrationToken = req.cookies?.registrationToken;

      if (!registrationToken) {
        throw new AppError('Registration session expired. Please register again.', 400);
      }

      const result = await this.authService.verifyOTPAndCompleteRegistration(
        { email, otp },
        registrationToken
      );

      // Clear registration token cookie
      res.clearCookie('registrationToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
      });

      res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Resend OTP
   */
  resendOTP = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email } = req.body;

      const result = await this.authService.resendOTP(email);

      res.status(200).json({
        success: true,
        message: 'OTP resent successfully. Please check your email.',
        data: {
          email,
          expiresIn: result.expiresIn,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Login
   */
  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email, password } = req.body;

      const result = await this.authService.login({ email, password });

      // Set auth tokens in HTTP-only cookies
      res.cookie('accessToken', result.tokens.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 15 * 60 * 1000, // 15 minutes
      });

      res.cookie('refreshToken', result.tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: {
          user: result.user,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Logout
   */
  logout = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Clear all auth cookies
      res.clearCookie('accessToken');
      res.clearCookie('refreshToken');
      res.clearCookie('registrationToken');

      res.status(200).json({
        success: true,
        message: 'Logout successful',
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get current user profile
   */
  getCurrentUser = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        throw new AppError('User not authenticated', 401);
      }

      const user = await this.authService.getCurrentUser(req.user.userId);

      res.status(200).json({
        success: true,
        message: 'User profile retrieved successfully',
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          isActive: user.isActive,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Search users
   */
  searchUsers = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        throw new AppError('Unauthorized', 401);
      }

      const { query } = req.query;

      if (!query || typeof query !== 'string') {
        res.json({
          success: true,
          data: [],
        });
        return;
      }

      const users = await this.authService.searchUsers(query, req.user.userId);

      res.json({
        success: true,
        data: users,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get all active users
   */
  getAllUsers = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        throw new AppError('Unauthorized', 401);
      }

      const users = await this.authService.getAllActiveUsers(req.user.userId);

      res.json({
        success: true,
        data: users,
      });
    } catch (error) {
      next(error);
    }
  };
}

export default AuthController;
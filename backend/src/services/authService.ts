import User, { UserRole } from '../models/userModel';
import { JwtService, IRegistrationPayload, ITokenPair } from './jwtService';
import { OTPService } from './otpService';
import { EmailService } from './emailService';
import AppError from '../utils/appError';
import { Op } from 'sequelize';

export interface IRegisterDTO {
  name: string;
  email: string;
  password: string;
}

export interface ILoginDTO {
  email: string;
  password: string;
}

export interface IVerifyOTPDTO {
  email: string;
  otp: string;
}

export interface IAuthResponse {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    isActive: boolean;
  };
  tokens: ITokenPair;
}

export class AuthService {
  constructor(
    private jwtService: JwtService,
    private otpService: OTPService,
    private emailService: EmailService
  ) {}

  /**
   * STEP 1: Initiate Registration
   * - Check if user exists
   * - Create registration token
   * - Send OTP
   */
  async initiateRegistration(data: IRegisterDTO): Promise<{
    registrationToken: string;
    expiresIn: number;
    email: string;
  }> {
    // Check if user already exists
    const existingUser = await User.findOne({ 
      where: { email: data.email } 
    });

    if (existingUser) {
      throw new AppError('User with this email already exists', 409);
    }

    // Create registration payload
    const registrationPayload: IRegistrationPayload = {
      name: data.name,
      email: data.email,
      password: data.password, // Will be hashed after OTP verification
      timestamp: Date.now(),
    };

    // Generate registration token (valid for 10 minutes)
    const registrationToken = this.jwtService.generateRegistrationToken(registrationPayload);

    // Generate and send OTP
    const { expiresIn } = await this.otpService.generateAndSendOTP(data.email);

    return {
      registrationToken,
      expiresIn,
      email: data.email,
    };
  }

  /**
   * STEP 2: Verify OTP and Complete Registration
   */
  async verifyOTPAndCompleteRegistration(
    data: IVerifyOTPDTO,
    registrationToken: string
  ): Promise<{ success: boolean; message: string }> {
    // 1. Verify OTP
    await this.otpService.verifyOTP(data.email, data.otp);

    // 2. Verify registration token
    let registrationData: IRegistrationPayload;
    try {
      registrationData = this.jwtService.verifyRegistrationToken(registrationToken);
    } catch (error) {
      throw new AppError('Registration session expired. Please register again.', 400);
    }

    // 3. Verify email matches
    if (registrationData.email !== data.email) {
      throw new AppError('Email mismatch. Please register again.', 400);
    }

    // 4. Double-check user doesn't exist
    const existingUser = await User.findOne({ 
      where: { email: data.email } 
    });

    if (existingUser) {
      throw new AppError('User with this email already exists', 409);
    }

    // 5. Create user in database (password will be hashed by model hook)
    await User.create({
      name: registrationData.name,
      email: registrationData.email,
      password: registrationData.password,
      isActive: true,
      role: UserRole.USER, // ✅ FIXED: Use enum instead of string literal
    });

    // 6. Send welcome email (non-blocking)
    this.emailService.sendWelcomeEmail(data.email, registrationData.name).catch(console.error);

    return {
      success: true,
      message: 'Email verified successfully. Your account has been created.',
    };
  }

  /**
   * Resend OTP
   */
  async resendOTP(email: string): Promise<{ expiresIn: number }> {
    // Check if user exists and is active
    const existingUser = await User.findOne({ 
      where: { email, isActive: true } 
    });

    if (existingUser) {
      throw new AppError('This email is already registered and verified.', 409);
    }

    // Resend OTP
    return this.otpService.resendOTP(email);
  }

  /**
   * Login
   */
  async login(data: ILoginDTO): Promise<IAuthResponse> {
    // Find user with password (include password field)
    const user = await User.findOne({
      where: { email: data.email },
      attributes: { include: ['password'] },
    });

    if (!user) {
      throw new AppError('Invalid email or password', 401);
    }

    // Check if user is active
    if (!user.isActive) {
      throw new AppError('Please verify your email first. Check your inbox for OTP.', 403);
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(data.password);
    if (!isPasswordValid) {
      throw new AppError('Invalid email or password', 401);
    }

    // Generate tokens
    const tokens = this.jwtService.generateTokenPair({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
      },
      tokens,
    };
  }

  /**
   * Get current user
   */
  async getCurrentUser(userId: string): Promise<User> {
    const user = await User.findByPk(userId);
    
    if (!user) {
      throw new AppError('User not found', 404);
    }
    
    return user;
  }

  /**
   * Search users
   */
  async searchUsers(query: string, excludeUserId: string): Promise<Partial<User>[]> {
    if (!query || query.length < 2) return [];

    const users = await User.findAll({
      where: {
        id: { [Op.ne]: excludeUserId },
        isActive: true,
        [Op.or]: [
          { name: { [Op.like]: `%${query}%` } },
          { email: { [Op.like]: `%${query}%` } },
        ],
      },
      attributes: ['id', 'name', 'email', 'role'],
      limit: 10,
    });

    return users;
  }

  /**
   * Get all active users
   */
  async getAllActiveUsers(excludeUserId: string): Promise<Partial<User>[]> {
    const users = await User.findAll({
      where: {
        id: { [Op.ne]: excludeUserId },
        isActive: true,
      },
      attributes: ['id', 'name', 'email', 'role'],
      limit: 50,
    });

    return users;
  }
}

export default AuthService;
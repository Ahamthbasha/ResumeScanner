import  OTP  from  '../models/otpModel'
import AppError from '../utils/appError';
import { EmailService } from './emailService'


export class OTPService {
  private emailService: EmailService;

  constructor(emailService: EmailService) {
    this.emailService = emailService;
  }

  generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async generateAndSendOTP(email: string): Promise<{ expiresIn: number }> {
    try {
      // Delete any existing OTPs for this email
      await OTP.destroy({ where: { email } });

      // Generate new OTP
      const otp = this.generateOTP();

      // Save OTP to database
      await OTP.create({ email, otp });

      // Send OTP email
      await this.emailService.sendOTPEmail(email, otp);

      return { expiresIn: 60 }; // 60 seconds
    } catch (error) {
      console.error('Failed to generate OTP:', error);
      throw new AppError('Failed to send OTP. Please try again.', 500);
    }
  }

  async verifyOTP(email: string, otp: string): Promise<boolean> {
    // Find the most recent OTP for this email
    const otpRecord = await OTP.findOne({
      where: { email },
      order: [['createdAt', 'DESC']],
    });

    if (!otpRecord) {
      throw new AppError('No OTP found. Please request a new one.', 400);
    }

    // Check if OTP is expired (60 seconds)
    const otpAge = Date.now() - otpRecord.createdAt.getTime();
    if (otpAge > 60 * 1000) {
      await OTP.destroy({ where: { email } });
      throw new AppError('OTP expired. Please request a new one.', 400);
    }

    // Verify OTP
    if (otpRecord.otp !== otp) {
      throw new AppError('Invalid OTP. Please try again.', 400);
    }

    // Delete OTP after successful verification
    await OTP.destroy({ where: { email } });

    return true;
  }

  async resendOTP(email: string): Promise<{ expiresIn: number }> {
    // Delete existing OTPs
    await OTP.destroy({ where: { email } });

    // Generate and send new OTP
    return this.generateAndSendOTP(email);
  }
}

export default OTPService;
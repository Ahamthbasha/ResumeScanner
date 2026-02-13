// import nodemailer from 'nodemailer';
// import dotenv from 'dotenv';
// import AppError from '../utils/appError';

// dotenv.config();

// export interface IEmailConfig {
//   user: string;
//   pass: string;
//   fromName?: string;
// }

// export class EmailService {
//   private transporter: nodemailer.Transporter;
//   private fromEmail: string;
//   private fromName: string;

//   constructor(config: IEmailConfig) {
//     this.fromEmail = config.user;
//     this.fromName = config.fromName || 'Resume Scanner';

//     this.transporter = nodemailer.createTransport({
//       service: 'gmail',
//       auth: {
//         user: config.user,
//         pass: config.pass,
//       },
//       pool: true,
//       maxConnections: 5,
//       maxMessages: 100,
//     });

//     this.verifyConnection();
//   }

//   private async verifyConnection(): Promise<void> {
//     try {
//       await this.transporter.verify();
//       console.log('✅ Email service configured successfully');
//     } catch (error) {
//       console.error('❌ Email service configuration error:', error);
//       if (process.env.NODE_ENV === 'production') {
//         throw new AppError('Email service configuration failed', 500);
//       }
//     }
//   }

//   async sendOTPEmail(email: string, otp: string): Promise<void> {
//     try {
//       const mailOptions = {
//         from: `"${this.fromName}" <${this.fromEmail}>`,
//         to: email,
//         subject: 'Your OTP for Registration - Resume Scanner',
//         html: this.getOTPEmailTemplate(otp),
//         text: `Your OTP for registration is: ${otp}. This code is valid for 60 seconds.`,
//       };

//       await this.transporter.sendMail(mailOptions);
//       console.log(`✅ OTP email sent to ${email}`);
//     } catch (error) {
//       console.error('Failed to send OTP email:', error);
//       if (process.env.NODE_ENV === 'production') {
//         throw new AppError('Failed to send OTP email. Please try again.', 500);
//       } else {
//         console.log(`=================================`);
//         console.log(`🔐 [DEV] OTP for ${email}: ${otp}`);
//         console.log(`=================================`);
//       }
//     }
//   }

//   async sendWelcomeEmail(email: string, name: string): Promise<void> {
//     try {
//       const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
      
//       const mailOptions = {
//         from: `"${this.fromName}" <${this.fromEmail}>`,
//         to: email,
//         subject: 'Welcome to Resume Scanner! 🎉',
//         html: this.getWelcomeEmailTemplate(name, frontendUrl),
//         text: `Welcome ${name}! Your account has been successfully verified. Login to start scanning resumes: ${frontendUrl}/login`,
//       };

//       await this.transporter.sendMail(mailOptions);
//       console.log(`✅ Welcome email sent to ${email}`);
//     } catch (error) {
//       console.error('Failed to send welcome email:', error);
//     }
//   }

//   private getOTPEmailTemplate(otp: string): string {
//     return `
//       <!DOCTYPE html>
//       <html>
//       <head>
//         <style>
//           body { font-family: Arial, sans-serif; line-height: 1.6; background-color: #f4f6f9; padding: 20px; }
//           .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
//           .header { background: linear-gradient(135deg, #2563eb, #1e40af); color: white; padding: 30px 20px; text-align: center; }
//           .otp-code { font-size: 48px; font-weight: 800; letter-spacing: 8px; color: #2563eb; text-align: center; padding: 30px; background: #f3f4f6; margin: 20px; border-radius: 8px; }
//           .footer { padding: 20px; text-align: center; background: #f9fafb; color: #6b7280; font-size: 12px; }
//         </style>
//       </head>
//       <body>
//         <div class="container">
//           <div class="header">
//             <h2>🔐 Email Verification</h2>
//             <p>Resume Scanner</p>
//           </div>
//           <div style="padding: 40px 30px;">
//             <p style="font-size: 18px;">Hello,</p>
//             <p>Your OTP for registration is:</p>
//             <div class="otp-code">${otp}</div>
//             <p style="color: #ef4444; font-size: 14px;">⏰ Valid for 60 seconds only!</p>
//             <p style="color: #6b7280; font-size: 14px;">Never share this OTP with anyone.</p>
//           </div>
//           <div class="footer">
//             <p>© ${new Date().getFullYear()} Resume Scanner. All rights reserved.</p>
//           </div>
//         </div>
//       </body>
//       </html>
//     `;
//   }

//   private getWelcomeEmailTemplate(name: string, frontendUrl: string): string {
//     return `
//       <!DOCTYPE html>
//       <html>
//       <head>
//         <style>
//           body { font-family: Arial, sans-serif; line-height: 1.6; background-color: #f4f6f9; padding: 20px; }
//           .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
//           .header { background: linear-gradient(135deg, #059669, #047857); color: white; padding: 40px 20px; text-align: center; }
//           .button { display: inline-block; background: #2563eb; color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 20px 0; }
//           .footer { padding: 20px; text-align: center; background: #f9fafb; color: #6b7280; font-size: 12px; }
//         </style>
//       </head>
//       <body>
//         <div class="container">
//           <div class="header">
//             <h1>🎉 Welcome, ${name}!</h1>
//             <p>Your email has been verified successfully</p>
//           </div>
//           <div style="padding: 40px 30px; text-align: center;">
//             <p style="font-size: 18px; margin-bottom: 20px;">Your account is now active!</p>
//             <a href="${frontendUrl}/login" class="button">🚀 Go to Dashboard</a>
//           </div>
//           <div class="footer">
//             <p>© ${new Date().getFullYear()} Resume Scanner</p>
//           </div>
//         </div>
//       </body>
//       </html>
//     `;
//   }
// }

// export default EmailService;





















import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import AppError from '../utils/appError';

dotenv.config();

export interface IEmailConfig {
  user: string;
  pass: string;
  fromName?: string;
}

export class EmailService {
  private transporter: nodemailer.Transporter;
  private fromEmail: string;
  private fromName: string;

  constructor(config: IEmailConfig) {
    this.fromEmail = config.user;
    this.fromName = config.fromName || 'Resume Scanner';

    // Use port 587 with STARTTLS instead of port 465
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // Use STARTTLS
      auth: {
        user: config.user,
        pass: config.pass,
      },
      tls: {
        rejectUnauthorized: false,
        ciphers: 'SSLv3'
      },
      pool: true,
      maxConnections: 5,
      maxMessages: 100,
      connectionTimeout: 10000, // 10 seconds
      greetingTimeout: 10000,
      socketTimeout: 10000,
    });

    this.verifyConnection();
  }

  private async verifyConnection(): Promise<void> {
    try {
      await this.transporter.verify();
      console.log('✅ Email service configured successfully');
    } catch (error) {
      console.error('❌ Email service configuration error:', error);
      
      // Don't throw error in production - allow app to start
      // Email will fail gracefully when needed
      if (process.env.NODE_ENV === 'production') {
        console.warn('⚠️ Email service not available - emails will be logged instead');
      } else {
        console.warn('⚠️ Email service verification failed - continuing anyway');
      }
    }
  }

  async sendOTPEmail(email: string, otp: string): Promise<void> {
    try {
      const mailOptions = {
        from: `"${this.fromName}" <${this.fromEmail}>`,
        to: email,
        subject: 'Your OTP for Registration - Resume Scanner',
        html: this.getOTPEmailTemplate(otp),
        text: `Your OTP for registration is: ${otp}. This code is valid for 60 seconds.`,
      };

      await this.transporter.sendMail(mailOptions);
      console.log(`✅ OTP email sent to ${email}`);
    } catch (error) {
      console.error('Failed to send OTP email:', error);
      
      // Always log OTP in console for fallback
      console.log(`=================================`);
      console.log(`🔐 OTP for ${email}: ${otp}`);
      console.log(`=================================`);
      
      // In production, log but don't fail the request
      if (process.env.NODE_ENV !== 'production') {
        // Only throw in development if you want strict error handling
        // throw new AppError('Failed to send OTP email. Please try again.', 500);
      }
    }
  }

  async sendWelcomeEmail(email: string, name: string): Promise<void> {
    try {
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
      
      const mailOptions = {
        from: `"${this.fromName}" <${this.fromEmail}>`,
        to: email,
        subject: 'Welcome to Resume Scanner! 🎉',
        html: this.getWelcomeEmailTemplate(name, frontendUrl),
        text: `Welcome ${name}! Your account has been successfully verified. Login to start scanning resumes: ${frontendUrl}/login`,
      };

      await this.transporter.sendMail(mailOptions);
      console.log(`✅ Welcome email sent to ${email}`);
    } catch (error) {
      console.error('Failed to send welcome email:', error);
      // Welcome emails are non-critical, so just log
    }
  }

  private getOTPEmailTemplate(otp: string): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; background-color: #f4f6f9; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
          .header { background: linear-gradient(135deg, #2563eb, #1e40af); color: white; padding: 30px 20px; text-align: center; }
          .otp-code { font-size: 48px; font-weight: 800; letter-spacing: 8px; color: #2563eb; text-align: center; padding: 30px; background: #f3f4f6; margin: 20px; border-radius: 8px; }
          .footer { padding: 20px; text-align: center; background: #f9fafb; color: #6b7280; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>🔐 Email Verification</h2>
            <p>Resume Scanner</p>
          </div>
          <div style="padding: 40px 30px;">
            <p style="font-size: 18px;">Hello,</p>
            <p>Your OTP for registration is:</p>
            <div class="otp-code">${otp}</div>
            <p style="color: #ef4444; font-size: 14px;">⏰ Valid for 60 seconds only!</p>
            <p style="color: #6b7280; font-size: 14px;">Never share this OTP with anyone.</p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} Resume Scanner. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  private getWelcomeEmailTemplate(name: string, frontendUrl: string): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; background-color: #f4f6f9; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
          .header { background: linear-gradient(135deg, #059669, #047857); color: white; padding: 40px 20px; text-align: center; }
          .button { display: inline-block; background: #2563eb; color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 20px 0; }
          .footer { padding: 20px; text-align: center; background: #f9fafb; color: #6b7280; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Welcome, ${name}!</h1>
            <p>Your email has been verified successfully</p>
          </div>
          <div style="padding: 40px 30px; text-align: center;">
            <p style="font-size: 18px; margin-bottom: 20px;">Your account is now active!</p>
            <a href="${frontendUrl}/login" class="button">🚀 Go to Dashboard</a>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} Resume Scanner</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }
}

export default EmailService;
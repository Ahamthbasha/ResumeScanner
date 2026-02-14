import { JwtService } from '../services/jwtService';
import { EmailService } from '../services/emailService';
import { OTPService } from '../services/otpService';
import { AuthService } from '../services/authService';
import AuthController from '../controllers/authController';
import AuthMiddleware from '../middleware/authMiddleware';

import AdminAuthService from '../services/adminAuthService';
import AdminAuthController from '../controllers/adminController/adminAuthController'; 
import AdminJobRoleController from '../controllers/adminController/adminJobController';

import { PDFParserService } from '../services/pdfParserService';
import { SkillExtractorService } from '../services/skillExtractorService';
import { ResumeService } from '../services/resumeService';
import { ResumeController } from '../controllers/resumeController';

class DIContainer {
  private static instance: DIContainer;
  
  public jwtService: JwtService;
  public emailService: EmailService;
  public otpService: OTPService;
  public authService: AuthService;
  
  public adminAuthService: AdminAuthService;
  public adminAuthController: AdminAuthController;
  public adminJobRoleController: AdminJobRoleController;
  
  public pdfParserService: PDFParserService;
  public skillExtractorService: SkillExtractorService;
  public resumeService: ResumeService;

  public authController: AuthController;
  public resumeController: ResumeController;
  
  public authMiddleware: AuthMiddleware;

  private constructor() {
    this.jwtService = new JwtService();
    
    this.emailService = new EmailService({
      apiKey: process.env.SENDGRID_API_KEY || '',
      fromEmail: process.env.SENDER_EMAIL || '',
      fromName: process.env.SENDER_NAME || 'Resume Scanner',
    });
    
    this.otpService = new OTPService(this.emailService);
    this.authService = new AuthService(this.jwtService, this.otpService, this.emailService);
    
    this.adminAuthService = new AdminAuthService(this.jwtService);
    this.adminAuthController = new AdminAuthController(this.adminAuthService);
    this.adminJobRoleController = new AdminJobRoleController();

    this.pdfParserService = new PDFParserService();
    this.skillExtractorService = new SkillExtractorService();
    this.resumeService = new ResumeService(
      this.pdfParserService,
      this.skillExtractorService
    );
    
    this.authController = new AuthController(this.authService);
    this.resumeController = new ResumeController(this.resumeService);
   
    this.authMiddleware = new AuthMiddleware(this.jwtService);
  }

  public static getInstance(): DIContainer {
    if (!DIContainer.instance) {
      DIContainer.instance = new DIContainer();
    }
    return DIContainer.instance;
  }
}

export const container = DIContainer.getInstance();
export default container;
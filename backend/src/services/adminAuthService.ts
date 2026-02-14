
import AppError from '../utils/appError';
import { JwtService, ITokenPair } from './jwtService';

export interface IAdminLoginDTO {
  email: string;
  password: string;
}

export interface IAdminAuthResponse {
  admin: {
    id: string;
    name: string;
    email: string;
    role: 'admin';
  };
  tokens: ITokenPair;
}

export class AdminAuthService {
  private adminEmail: string;
  private adminPassword: string;
  private adminName: string;
  private adminId: string = '00000000-0000-0000-0000-000000000000'; 

  constructor(private jwtService: JwtService) {
    this.adminEmail = process.env.ADMIN_EMAIL || 'admin@resumescanner.com';
    this.adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123';
    this.adminName = process.env.ADMIN_NAME || 'System Administrator';
  }

  async login(data: IAdminLoginDTO): Promise<IAdminAuthResponse> {
    if (data.email !== this.adminEmail) {
      throw new AppError('Invalid admin credentials', 401);
    }

    const isPasswordValid = data.password === this.adminPassword;
    
    if (!isPasswordValid) {
      throw new AppError('Invalid admin credentials', 401);
    }

    const tokens = this.jwtService.generateTokenPair({
      userId: this.adminId,
      email: this.adminEmail,
      role: 'admin',
    });

    return {
      admin: {
        id: this.adminId,
        name: this.adminName,
        email: this.adminEmail,
        role: 'admin',
      },
      tokens,
    };
  }
}

export default AdminAuthService;
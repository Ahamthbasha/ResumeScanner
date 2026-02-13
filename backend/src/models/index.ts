import { sequelize } from '../config/database';
import User from './userModel'; 
import OTP from './otpModel'; 
import Resume from './ResumeModel'; 
import JobRole from './jobRoleModel'; 
import ScanHistory from './scanHistoryModel'; 

// ============ ASSOCIATIONS ============

// User ↔ Resume
User.hasMany(Resume, { foreignKey: 'userId', as: 'resumes' });
Resume.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// User ↔ ScanHistory
User.hasMany(ScanHistory, { foreignKey: 'userId', as: 'scanHistory' });
ScanHistory.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Resume ↔ ScanHistory
Resume.hasMany(ScanHistory, { foreignKey: 'resumeId', as: 'scans' });
ScanHistory.belongsTo(Resume, { foreignKey: 'resumeId', as: 'resume' });

// JobRole ↔ ScanHistory
JobRole.hasMany(ScanHistory, { foreignKey: 'jobRoleId', as: 'scans' });
ScanHistory.belongsTo(JobRole, { foreignKey: 'jobRoleId', as: 'jobRole' });

export {
  sequelize,
  User,
  OTP,
  Resume,
  JobRole,
  ScanHistory,
};
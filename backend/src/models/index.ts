import sequelize from '../config/database';
import User from './userModel';
import Resume from './ResumeModel';
import ScanHistory from './scanHistoryModel';
import JobRole from './jobRoleModel';
import OTP from './otpModel';

// Define associations
User.hasMany(Resume, { foreignKey: 'userId', as: 'resumes' });
Resume.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.hasMany(ScanHistory, { foreignKey: 'userId', as: 'scanHistory' });
ScanHistory.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Resume.hasMany(ScanHistory, { foreignKey: 'resumeId', as: 'scans' });
ScanHistory.belongsTo(Resume, { foreignKey: 'resumeId', as: 'resume' });

JobRole.hasMany(ScanHistory, { foreignKey: 'jobRoleId', as: 'scans' });
ScanHistory.belongsTo(JobRole, { foreignKey: 'jobRoleId', as: 'jobRole' });

export { sequelize, User, Resume, ScanHistory, JobRole, OTP };
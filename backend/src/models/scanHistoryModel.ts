import { DataTypes, Model, Optional } from 'sequelize';
import  sequelize  from '../config/database';

export interface ScanHistoryAttributes {
  id: string;
  userId: string;
  resumeId: string;
  jobRoleId: string;
  jobRoleTitle: string;
  fileName: string;
  matchPercentage: number;
  matchedSkills: string[];
  missingSkills: string[];
  extraSkills: string[];
  suggestions: string[];
  scanDuration: number;
  createdAt?: Date;
}

export interface ScanHistoryCreationAttributes extends Optional<ScanHistoryAttributes, 'id' | 'extraSkills' | 'suggestions'> {}

class ScanHistory extends Model<ScanHistoryAttributes, ScanHistoryCreationAttributes> implements ScanHistoryAttributes {
  public id!: string;
  public userId!: string;
  public resumeId!: string;
  public jobRoleId!: string;
  public jobRoleTitle!: string;
  public fileName!: string;
  public matchPercentage!: number;
  public matchedSkills!: string[];
  public missingSkills!: string[];
  public extraSkills!: string[];
  public suggestions!: string[];
  public scanDuration!: number;
  
  public readonly createdAt!: Date;

  toJSON() {
    const values = { ...this.get() };
    return values;
  }
}

ScanHistory.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    resumeId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'resumes',
        key: 'id',
      },
    },
    jobRoleId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'job_roles',
        key: 'id',
      },
    },
    jobRoleTitle: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    fileName: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    matchPercentage: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    matchedSkills: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: [],
    },
    missingSkills: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: [],
    },
    extraSkills: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
    },
    suggestions: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
    },
    scanDuration: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'ScanHistory',
    tableName: 'scan_histories',
    timestamps: true,
    updatedAt: false,
    indexes: [
      {
        fields: ['userId'],
      },
      {
        fields: ['createdAt'],
      },
      {
        fields: ['matchPercentage'],
      },
    ],
  }
);

export default ScanHistory;
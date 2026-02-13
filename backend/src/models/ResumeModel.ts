import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

export interface ResumeAttributes {
  id: string;
  userId: string;
  fileName: string;
  filePath: string;
  fileSize: number;
  extractedText: string;
  extractedSkills: string[];
  categorizedSkills?: Record<string, string[]>;
  pageCount?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ResumeCreationAttributes extends Optional<ResumeAttributes, 'id' | 'categorizedSkills' | 'pageCount'> {}

class Resume extends Model<ResumeAttributes, ResumeCreationAttributes> implements ResumeAttributes {
  public id!: string;
  public userId!: string;
  public fileName!: string;
  public filePath!: string;
  public fileSize!: number;
  public extractedText!: string;
  public extractedSkills!: string[];
  public categorizedSkills?: Record<string, string[]>;
  public pageCount?: number;
  
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  toJSON() {
    const values = { ...this.get() };
    return values;
  }
}

Resume.init(
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
    fileName: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    filePath: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    fileSize: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    extractedText: {
      type: DataTypes.TEXT('long'),
      allowNull: false,
    },
    extractedSkills: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: [],
    },
    categorizedSkills: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    pageCount: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'Resume',
    tableName: 'resumes',
    indexes: [
      {
        fields: ['userId'],
      },
      {
        fields: ['createdAt'],
      },
    ],
  }
);

export default Resume;
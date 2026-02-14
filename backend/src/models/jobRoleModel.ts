import { DataTypes, Model, Optional } from 'sequelize';
import sequelize  from '../config/database';

export interface JobRoleAttributes {
  id: string;
  title: string;
  description: string;
  requiredSkills: string[];
  category?: string;
  experienceLevel?: string;
  minExperience?: number;
  maxExperience?: number;
  isActive: boolean;
  createdBy: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface JobRoleCreationAttributes extends Optional<JobRoleAttributes, 'id' | 'category' | 'experienceLevel' | 'minExperience' | 'maxExperience' | 'isActive'> {}

class JobRole extends Model<JobRoleAttributes, JobRoleCreationAttributes> implements JobRoleAttributes {
  public id!: string;
  public title!: string;
  public description!: string;
  public requiredSkills!: string[];
  public category?: string;
  public experienceLevel?: string;
  public minExperience?: number;
  public maxExperience?: number;
  public isActive!: boolean;
  public createdBy!: string;
  
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  toJSON() {
    const values = { ...this.get() };
    return values;
  }
}

JobRole.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    requiredSkills: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: [],
      validate: {
        isValidArray(value: any) {
          if (!Array.isArray(value)) {
            throw new Error('Required skills must be an array');
          }
        }
      }
    },
    category: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    experienceLevel: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    minExperience: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    maxExperience: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    createdBy: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'JobRole',
    tableName: 'job_roles',
    indexes: [
      {
        fields: ['title'],
        unique: true,
      },
      {
        fields: ['category'],
      },
      {
        fields: ['isActive'],
      },
    ],
  }
);

export default JobRole;
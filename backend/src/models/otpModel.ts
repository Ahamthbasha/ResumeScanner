import { DataTypes, Model, Optional, Op } from 'sequelize';
import sequelize from '../config/database';

interface OTPAttributes {
  id: string;
  email: string;
  otp: string;
  expiresAt: Date;
  createdAt?: Date;
}

interface OTPCreationAttributes extends Optional<OTPAttributes, 'id' | 'createdAt'> {}

class OTP extends Model<OTPAttributes, OTPCreationAttributes> implements OTPAttributes {
  public id!: string;
  public email!: string;
  public otp!: string;
  public expiresAt!: Date;
  public readonly createdAt!: Date;
}

OTP.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    otp: {
      type: DataTypes.STRING(6),
      allowNull: false,
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: 'OTP',
    tableName: 'otps',
    timestamps: false,
    indexes: [
      {
        fields: ['email'],
      },
      {
        fields: ['expiresAt'],
      },
    ],
  }
);

setInterval(async () => {
  try {
    await OTP.destroy({
      where: {
        expiresAt: {
          [Op.lt]: new Date(),
        },
      },
    });
  } catch (error) {
    console.error('Error cleaning up expired OTPs:', error);
  }
}, 5 * 60 * 1000);

export default OTP;
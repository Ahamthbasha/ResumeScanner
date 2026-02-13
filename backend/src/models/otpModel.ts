import { DataTypes, Model, Optional, Op } from 'sequelize';
import { sequelize } from '../config/database';  // ✅ Make sure this path is correct

export interface OTPAttributes {
  id: string;
  email: string;
  otp: string;
  createdAt?: Date;
}

export interface OTPCreationAttributes extends Optional<OTPAttributes, 'id'> {}

class OTP extends Model<OTPAttributes, OTPCreationAttributes> implements OTPAttributes {
  public id!: string;
  public email!: string;
  public otp!: string;
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
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    otp: {
      type: DataTypes.STRING(6),
      allowNull: false,
    },
  },
  {
    sequelize,  // ✅ This must be the sequelize instance
    modelName: 'OTP',
    tableName: 'otps',
    timestamps: true,
    updatedAt: false,
    indexes: [
      {
        fields: ['email'],
      },
      {
        fields: ['createdAt'],
      },
    ],
  }
);

// TTL - Auto delete after 60 seconds
export const setupOTPExpiry = () => {
  setInterval(async () => {
    const expiryTime = new Date(Date.now() - 60 * 1000);
    await OTP.destroy({
      where: {
        createdAt: {
          [Op.lt]: expiryTime,
        },
      },
    });
  }, 30000);
};

export default OTP;
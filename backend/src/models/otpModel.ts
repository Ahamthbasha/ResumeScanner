// import { DataTypes, Model, Optional, Op } from 'sequelize';
// import { sequelize } from '../config/database';  // ✅ Make sure this path is correct

// export interface OTPAttributes {
//   id: string;
//   email: string;
//   otp: string;
//   createdAt?: Date;
// }

// export interface OTPCreationAttributes extends Optional<OTPAttributes, 'id'> {}

// class OTP extends Model<OTPAttributes, OTPCreationAttributes> implements OTPAttributes {
//   public id!: string;
//   public email!: string;
//   public otp!: string;
//   public readonly createdAt!: Date;
// }

// OTP.init(
//   {
//     id: {
//       type: DataTypes.UUID,
//       defaultValue: DataTypes.UUIDV4,
//       primaryKey: true,
//     },
//     email: {
//       type: DataTypes.STRING(100),
//       allowNull: false,
//       validate: {
//         isEmail: true,
//       },
//     },
//     otp: {
//       type: DataTypes.STRING(6),
//       allowNull: false,
//     },
//   },
//   {
//     sequelize,  // ✅ This must be the sequelize instance
//     modelName: 'OTP',
//     tableName: 'otps',
//     timestamps: true,
//     updatedAt: false,
//     indexes: [
//       {
//         fields: ['email'],
//       },
//       {
//         fields: ['createdAt'],
//       },
//     ],
//   }
// );

// // TTL - Auto delete after 60 seconds
// export const setupOTPExpiry = () => {
//   setInterval(async () => {
//     const expiryTime = new Date(Date.now() - 60 * 1000);
//     await OTP.destroy({
//       where: {
//         createdAt: {
//           [Op.lt]: expiryTime,
//         },
//       },
//     });
//   }, 30000);
// };

// export default OTP;


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

// Auto-delete expired OTPs every 5 minutes
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
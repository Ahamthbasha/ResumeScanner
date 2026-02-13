// import { Sequelize } from 'sequelize';
// import dotenv from 'dotenv';

// dotenv.config();

// // ✅ Make sure this is a NAMED export
// export const sequelize = new Sequelize(
//   process.env.DB_NAME || 'resume_scanner',
//   process.env.DB_USER || 'root',
//   process.env.DB_PASSWORD || 'root',
//   {
//     host: process.env.DB_HOST || 'localhost',
//     port: parseInt(process.env.DB_PORT || '3306'),
//     dialect: 'mysql',
//     logging: process.env.NODE_ENV === 'development' ? console.log : false,
//     pool: {
//       max: 5,
//       min: 0,
//       acquire: 30000,
//       idle: 10000,
//     },
//   }
// );

// export const initializeDatabase = async () => {
//   try {
//     await sequelize.authenticate();
//     console.log('✅ Database connection established');
    
//     // await sequelize.sync({ alter: process.env.NODE_ENV === 'development' });
//     console.log('✅ Database models synchronized');
//   } catch (error) {
//     console.error('❌ Database connection failed:', error);
//     throw error;
//   }
// };















import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

// ✅ SSL configuration for Aiven (cloud database)
const dialectOptions = process.env.NODE_ENV === 'production' 
  ? {
      ssl: {
        require: true,
        rejectUnauthorized: true
      }
    }
  : {}; // No SSL for local development

// ✅ Named export
export const sequelize = new Sequelize(
  process.env.DB_NAME || 'resume_scanner',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || 'root',
  {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    dialect: 'mysql',
    dialectOptions,  // ✅ Add SSL config here
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 10,        // ✅ Increased for production
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
);

export const initializeDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully');
    console.log(`📊 Connected to: ${process.env.DB_HOST || 'localhost'}`);
    
    // Sync models (be careful in production!)
    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync({ alter: true });
      console.log('✅ Database models synchronized (development mode)');
    } else {
      // In production, just check connection, don't auto-sync
      console.log('✅ Production mode - skipping auto-sync');
    }
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    console.error('Check your environment variables:');
    console.error('DB_HOST:', process.env.DB_HOST);
    console.error('DB_PORT:', process.env.DB_PORT);
    console.error('DB_USER:', process.env.DB_USER);
    console.error('DB_NAME:', process.env.DB_NAME);
    throw error;
  }
};
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME || 'defaultdb',
  process.env.DB_USER || 'avnadmin',
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '23507'),
    dialect: 'mysql',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
      connectTimeout: 60000,
    },
  }
);

export async function initializeDatabase() {
  try {
    await sequelize.authenticate();
    console.log(' Database connection established successfully');

    await sequelize.sync({ 
      force: process.env.NODE_ENV === 'development',
      alter: process.env.NODE_ENV !== 'development'
    });
    console.log('Database models synchronized');
    
    return sequelize;
  } catch (error) {
    console.error('Database connection failed:', error);
    console.log('Check your environment variables:');
    console.log('DB_HOST:', process.env.DB_HOST);
    console.log('DB_PORT:', process.env.DB_PORT);
    console.log('DB_USER:', process.env.DB_USER);
    console.log('DB_NAME:', process.env.DB_NAME);
    throw error;
  }
}

export default sequelize;
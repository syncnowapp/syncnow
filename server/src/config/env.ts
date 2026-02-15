import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '3001', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  databaseUrl: process.env.DATABASE_URL,
};

if (!config.databaseUrl) {
  throw new Error('DATABASE_URL environment variable is required');
}

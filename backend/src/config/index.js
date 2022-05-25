import "dotenv/config";

export const config = {
  port: process.env.PORT || 3000,
  jwtSecret: process.env.PRIVATE_JWT,
  dbUser: process.env.DB_USERNAME,
  dbPassword: process.env.DB_PASSWORD,
  dbHost: process.env.DB_HOST,
  dbName: process.env.DB_NAME,
  environment: process.env.NODE_ENV
};

import "dotenv/config";

export const {
  port,
  jwtSecret,
  dbUser,
  dbPassword,
  dbHost,
  dbName,
  environment,
  isProductionEnvironment,
  oauthClientId,
  oauthClientSecret,
  callbackUrl,
  callbackUrlDevelopment,
} = {
  isProductionEnvironment: process.env.NODE_ENV === "production",
  port: process.env.PORT || 3000,
  jwtSecret: process.env.PRIVATE_JWT,
  dbUser: process.env.DB_USERNAME,
  dbPassword: process.env.DB_PASSWORD,
  dbHost: process.env.DB_HOST,
  dbName: process.env.DB_NAME,
  environment: process.env.NODE_ENV,
  oauthClientId: process.env.OAUTH_CLIENT_ID,
  oauthClientSecret: process.env.OAUTH_CLIENT_SECRET,
  callbackUrl: process.env.CALLBACK_URL,
  callbackUrlDevelopment: process.env.CALLBACK_URL_DEVELOPMENT,
};

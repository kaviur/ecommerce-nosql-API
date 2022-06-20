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
  googleClientId,
  googleClientSecret,
  callbackUrl,
  sessionSecret,
  facebookAppId,
  facebookAppSecret,
  twitterAppId,
  twitterAppSecret,
  githubAppId,
  githubAppSecret,
  instagramAppId,
  instagramAppSecret,
  apiVersion,
  email_port,
  email_host,
  email_secure,
  email_user,
  email_password,
  stripe_public,
  stripe_secret,
  endpointsecretStripe
} = {
  isProductionEnvironment: process.env.NODE_ENV === "production",
  port: process.env.PORT || 3000,
  jwtSecret: process.env.PRIVATE_JWT,
  dbUser: process.env.DB_USERNAME,
  dbPassword: process.env.DB_PASSWORD,
  dbHost: process.env.DB_HOST,
  dbName: process.env.DB_NAME,
  environment: process.env.NODE_ENV,
  googleClientId: process.env.GOOGLE_CLIENT_ID,
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackUrl:
    process.env.NODE_ENV === "production"
      ? `${process.env.CALLBACK_URL}:${process.env.PORT || 3000}`
      : `${process.env.CALLBACK_URL_DEVELOPMENT}:${process.env.PORT || 3000}`,
  sessionSecret: process.env.SESION_SECRET,
  facebookAppId: process.env.FACEBOOK_APP_ID,
  facebookAppSecret: process.env.FACEBOOK_APP_SECRET,
  twitterAppId: process.env.TWITTER_APP_ID,
  twitterAppSecret: process.env.TWITTER_APP_SECRET,
  githubAppId: process.env.GITHUB_APP_ID,
  githubAppSecret: process.env.GITHUB_APP_SECRET,
  instagramAppId: process.env.INSTAGRAM_APP_ID,
  instagramAppSecret: process.env.INSTAGRAM_APP_SECRET,
  apiVersion: process.env.API_VERSION,
  email_host: process.env.EMAIL_HOST,
  email_port: process.env.EMAIL_PORT,
  email_secure: process.env.EMAIL_SECURE,
  email_user: process.env.EMAIL_USER,
  email_password: process.env.EMAIL_PASSWORD,
  stripe_public: process.env.STRIPE_PK,
  stripe_secret: process.env.STRIPE_SK,
  endpointsecretStripe:process.env.ENDPOINT_SECRET
};

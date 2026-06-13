import dotenv from "dotenv";

dotenv.config();

if (!process.env.MONGO_URI || !process.env.JWT_SECRET) {
  throw new Error("Missing required environment variables");
}

const config = {
  PORT: process.env.PORT || 3000,

  MONGO_URI: process.env.MONGO_URI,

  JWT_SECRET: process.env.JWT_SECRET,

  REDIS_URL: process.env.REDIS_URL,
  FRONTEND_URL: process.env.FRONTEND_URL,
  NODE_ENV : process.env.NODE_ENV,
};

export default config;

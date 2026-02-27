import dotenv from "dotenv";
import logger from "./logger.config.js";

type ServerConfig = {
  PORT: number;
  MONGO_URI: string;
  REDIS_URI: string;
};

export function loadEnv() {
  dotenv.config();
  logger.info("Environment variables loaded");
}

loadEnv();

export const serverConfig: ServerConfig = {
  PORT: Number(process.env.PORT) || 3001,
  MONGO_URI: process.env.MONGO_URI || "mongodb://localhost:27017/url-shortner",
  REDIS_URI: process.env.REDIS_URI || "redis://localhost:6379",
};

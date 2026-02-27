import { createClient } from "redis";
import logger from "./logger.config.js";
import { serverConfig } from "./index.js";

export const redisClient = createClient({
  username: serverConfig.REDIS_USERNAME,
  password: serverConfig.REDIS_PASSWORD,
  socket: {
    host: serverConfig.REDIS_HOST,
    port: serverConfig.REDIS_PORT,
  },
});

redisClient.on("error", (err) => logger.info("Redis Client Error", err));
redisClient.on("connect", () => logger.info("Redis Client Connected"));

export async function initRedis() {
  try {
    await redisClient.connect();
    logger.info("Connected to Redis successfully");
  } catch (error) {
    logger.info("Error connecting to Redis:", error);
  }
}

export async function closeRedis() {
  try {
    await redisClient.quit();
    logger.info("Disconnected from Redis successfully");
  } catch (error) {
    logger.info("Error disconnecting from Redis:", error);
  }
}

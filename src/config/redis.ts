import { createClient, RedisClientType } from "redis";
import logger from "./logger.config.js";
import { serverConfig } from "./index.js";

let redisClient: RedisClientType | null = null;

/**
 * Initialize Redis (Singleton)
 */
export const initRedis = async (): Promise<RedisClientType> => {
  if (redisClient && redisClient.isOpen) {
    console.log("Redis already connected");
    return redisClient;
  }

  redisClient = createClient({
    username: serverConfig.REDIS_USERNAME,
    password: serverConfig.REDIS_PASSWORD,
    socket: {
        host: serverConfig.REDIS_HOST,
        port: serverConfig.REDIS_PORT
    }
  });

  redisClient.on("connect", () => {
    logger.info("✅ Redis Client Connected");
  });

  redisClient.on("ready", () => {
    logger.info("🚀 Redis Client Ready");
  });

  redisClient.on("error", (err) => {
    logger.error("❌ Redis Client Error:", err);
  });

  redisClient.on("end", () => {
    logger.info("🔌 Redis Connection Closed");
  });

  await redisClient.connect();

  return redisClient;
};

/**
 * Get Redis Client (after init)
 */
export const getRedisClient = (): RedisClientType => {
  if (!redisClient) {
    throw new Error("Redis not initialized. Call initRedis() first.");
  }
  return redisClient;
};

/**
 * Graceful shutdown
 */
export const closeRedis = async (): Promise<void> => {
  if (redisClient && redisClient.isOpen) {
    await redisClient.quit();
    logger.info("🛑 Redis disconnected gracefully");
  }
};
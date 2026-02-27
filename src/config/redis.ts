import { createClient, RedisClientType } from "redis";
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
    url: serverConfig.REDIS_URI,
    socket: {
      reconnectStrategy: (retries) => {
        console.log(`Redis reconnect attempt: ${retries}`);
        return Math.min(retries * 100, 3000);
      },
    },
  });

  redisClient.on("connect", () => {
    console.log("✅ Redis Client Connected");
  });

  redisClient.on("ready", () => {
    console.log("🚀 Redis Client Ready");
  });

  redisClient.on("error", (err) => {
    console.error("❌ Redis Client Error:", err);
  });

  redisClient.on("end", () => {
    console.log("🔌 Redis Connection Closed");
  });

  await redisClient.connect();
  console.log("🔥 Connected to Redis successfully");

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
    console.log("🛑 Redis disconnected gracefully");
  }
};
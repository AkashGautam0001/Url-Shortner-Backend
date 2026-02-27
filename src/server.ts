import express from "express";
import v1Router from "./routers/v1/index.router.js";
import { serverConfig } from "./config/index.js";
import {
  appErrorHandler,
  genericErrorHandler,
} from "./middlewares/error.middleware.js";
import logger from "./config/logger.config.js";
import { attachCorrelationIdMiddleware } from "./middlewares/correlation.middleware.js";
import { connectDB } from "./config/db.config.js";
import { closeRedis, initRedis } from "./config/redis.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * Routes
 */

app.use(attachCorrelationIdMiddleware);
app.use("/api/v1", v1Router);

/**
 * Add the error handler middleware
 */

app.use(appErrorHandler);
app.use(genericErrorHandler);

app.listen(process.env.PORT, async () => {
  logger.info(`Server running at http://localhost:${serverConfig.PORT}`);
  await connectDB();
  await initRedis();
  logger.info("Press Ctrl+C to stop server");
});

process.on("SIGINT", async () => {
  console.log("Shutting down server...");
  await closeRedis();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  console.log("Shutting down server...");
  await closeRedis();
  process.exit(0);
});
import express, { Request, Response } from "express";
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
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { trpcRouter } from "./routers/trpc/index.js";
import { UrlService } from "./services/url.service.js";
import { UrlRepository } from "./repositories/url.repository.js";
import { CacheRepository } from "./repositories/cache.repository.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * Routes
 */

app.use(attachCorrelationIdMiddleware);

app.use("/trpc", createExpressMiddleware({ router: trpcRouter }));

app.get("/:shortUrl", async (req: Request, res: Response) => {
  const { shortUrl } = req.params;
  const urlService = new UrlService(new UrlRepository(), new CacheRepository());
  const url = await urlService.getOriginalUrl(shortUrl);

  if (!url)
    return res.status(404).json({ success: false, message: "URL not found" });

  await urlService.incrementClicks(shortUrl);
  return res.redirect(url.originalUrl);
});

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

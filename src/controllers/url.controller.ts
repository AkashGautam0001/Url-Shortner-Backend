import z from "zod";
import { publicProcedure } from "../routers/trpc/context.js";
import { UrlRepository } from "../repositories/url.repository.js";
import { CacheRepository } from "../repositories/cache.repository.js";
import { UrlService } from "../services/url.service.js";
import { InternalServerError } from "../utils/errors/app.error.js";
import logger from "../config/logger.config.js";

const urlService = new UrlService(new UrlRepository(), new CacheRepository());

export const urlController = {
  create: publicProcedure
    .input(z.object({ originalUrl: z.string().url("Invalid URL") }))
    .mutation(async ({ input }) => {
      try {
        const result = await urlService.createShortUrl(input.originalUrl);
        return result;
      } catch (error) {
        logger.error("Error creating short URL:", error);
        throw new InternalServerError("Failed to create short URL");
      }
    }),

  getOriginalUrl: publicProcedure
    .input(z.object({ shortUrl: z.string() }))
    .query(async ({ input }) => {
      try {
        const result = await urlService.getOriginalUrl(input.shortUrl);
        return result;
      } catch (error) {
        logger.error("Error getting original URL:", error);
        throw new InternalServerError("Failed to get original URL");
      }
    }),
}
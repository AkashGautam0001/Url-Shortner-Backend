import mongoose from "mongoose";
import { serverConfig } from "./index.js";
import logger from "./logger.config.js";

export async function connectDB() {
    try {
        await mongoose.connect(serverConfig.MONGO_URI);
        logger.info("Connected to MongoDB successfully");
    } catch (error) {
        logger.info("Error connecting to MongoDB:", error);
    }
}
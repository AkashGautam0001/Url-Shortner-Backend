import mongoose from "mongoose";
import { serverConfig } from "./index.js";

export async function connectDB() {
    try {
        await mongoose.connect(serverConfig.MONGO_URI);
        console.log("Connected to MongoDB successfully");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    }
}
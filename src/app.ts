import express from "express";
import { RequestMetadataCollectHandler } from "./handlers/RequestMetadataCollectHandler";
import earthquakeDataRoutes from "./routes/EarthquakeDataRoutes";
import earthquakeDataStatisticsRoutes from "./routes/EarthquakeDataStatisticsRoutes";
import { ErrorHandler } from "./handlers/ErrorHandler";
import authRoutes from "./routes/AuthRoutes";

const app = express();

// Middleware: Parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware: Log metadata for all incoming API requests (disabled in test environment)
if (process.env.NODE_ENV !== "test") {
  app.use(RequestMetadataCollectHandler.logMetadata);
}

// Register all endpoints
app.use("/auth", authRoutes);
app.use("/earthquakes-data", earthquakeDataRoutes);
app.use("/earthquakes-data/statistic", earthquakeDataStatisticsRoutes);

// Global error handler (must be last)
app.use(ErrorHandler.handleError);

export default app;

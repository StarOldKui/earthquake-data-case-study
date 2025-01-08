import express from "express";
import { RequestMetadataCollectHandler } from "./handlers/RequestMetadataCollectHandler";
import earthquakeDataRoutes from "./routes/EarthquakeDataRoutes";
import earthquakeDataStatisticsRoutes from "./routes/EarthquakeDataStatisticsRoutes";
import { ErrorHandler } from "./handlers/ErrorHandler";
import authRoutes from "./routes/AuthRoutes";

const app = express();
const port = process.env.PORT || 3000;

// Middleware: Parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware: Log metadata for all incoming API requests
app.use(RequestMetadataCollectHandler.logMetadata);

// Register all endpoints
app.use("/auth", authRoutes);
app.use("/earthquakes-data", earthquakeDataRoutes);
app.use("/earthquakes-data/statistic", earthquakeDataStatisticsRoutes);

// Global error handler (must be last)
app.use(ErrorHandler.handleError);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

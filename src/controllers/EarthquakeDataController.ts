import { NextFunction, Request, Response } from "express";
import { APIResponse } from "../models/APIResponse";
import { EarthquakeDataService } from "../services/EarthquakeDataService";
import { AppConfig } from "../config/appConfig";
import { validationResult } from "express-validator";

export class EarthquakeDataController {
  private earthquakeService: EarthquakeDataService;

  constructor() {
    // Instantiate the service
    this.earthquakeService = new EarthquakeDataService();
  }

  /**
   * Mock endpoint to fetch and store recent earthquakes
   * Simulates fetching data with a 2-second delay and testing error handling.
   *
   * @param req - Express Request object.
   * @param res - Express Response object.
   * @param next - Express NextFunction for error handling.
   */
  async mockFetchAndStore(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      // Simulate a 2-second delay to mimic real-world processing
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Simulate an error for testing purposes
      if (!req.query.test) {
        throw new Error("Missing required 'test' query parameter");
      }

      // Respond with success
      const response: APIResponse = {
        status: 200,
        success: true,
        message:
          "Successfully fetched and stored 100 most recent earthquakes into the database!",
        data: null,
      };

      // Log the response data to the console
      console.log("API Response:", response);

      res.status(200).json(response);
    } catch (error) {
      // Pass error to the global error handler
      next(error);
    }
  }

  /**
   * Fetches and stores the most recent 100 earthquakes into the database.
   *
   * @param req - Express Request object.
   * @param res - Express Response object.
   * @param next - Express NextFunction for error handling.
   */
  async fetchAndStore(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    console.log(`Endpoint ${req.originalUrl} invoked.`);

    try {
      const apiUrl = AppConfig.EarthquakeAPI.Url;

      const result =
        await this.earthquakeService.fetchAndStoreEarthquakes(apiUrl);

      const response: APIResponse = {
        status: 200,
        success: true,
        message:
          "Successfully fetched and stored the most recent 100 earthquakes.",
        data: result,
      };

      console.log("API Response:", response);

      res.status(200).json(response);
    } catch (error) {
      // Pass error to the global error handler
      next(error);
    }
  }

  /**
   * Endpoint to list earthquakes with pagination and filtering.
   *
   * Query Parameters:
   * - `pageSize` (number, required): Number of records per page (default: 10). Must be a positive integer no more than 100.
   * - `sort` (string, required): Sort parameter, either 'occurrenceTimestamp' or 'magnitude'.
   * - `sortOrder` (string, required): Sort order, either 'asc' (ascending) or 'desc' (descending).
   * - `occurStartDate` (number, optional): Filter for earthquakes occurring after this timestamp (in milliseconds).
   * - `occurEndDate` (number, optional): Filter for earthquakes occurring before this timestamp (in milliseconds).
   * - `location` (string, optional): Filter by location keyword (case-insensitive).
   * - `minMagnitude` (number, optional): Minimum magnitude to filter results. Must be non-negative.
   * - `maxMagnitude` (number, optional): Maximum magnitude to filter results. Must be non-negative.
   *
   * Validation:
   * - Query parameters are validated using `express-validator` in the `EarthquakeDataValidation` class.
   * - If validation fails, a `400 Bad Request` response is returned with the validation error details.
   *
   * @param req - Express Request object.
   * @param res - Express Response object.
   * @param next - Express NextFunction for error handling.
   */
  async listEarthquakes(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    console.log(`Endpoint ${req.originalUrl} invoked.`);
    console.log(`Request Query Parameters:`, req.query);

    // Validate request parameters
    const errors = validationResult(req);
    // If there are validation errors, respond with validation errors
    if (!errors.isEmpty()) {
      console.log(`Validation failed. Errors:`, errors.array());

      const response: APIResponse = {
        status: 400,
        success: false,
        message: "Invalid query parameters.",
        data: errors.array(),
      };

      res.status(400).json(response);

      return;
    }

    // Start processing
    try {
      const result = await this.earthquakeService.getEarthquakes(req.query);

      const response: APIResponse = {
        status: 200,
        success: true,
        message: result.items.length
          ? "Earthquake data retrieved successfully."
          : "No earthquakes found for the given parameters.",
        data: result,
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
}

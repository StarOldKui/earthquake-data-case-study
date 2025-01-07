import { Request, Response, NextFunction } from "express";
import { APIResponse } from "../models/APIResponse";
import { EarthquakeDataService } from "../services/EarthquakeDataService";
import { AppConfig } from "../config/appConfig";

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
    console.log(`Endpoint ${req.path} invoked.`);
    console.log(`Request Query Parameters:`, req.query);
    console.log(`Request Body:`, req.body);

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
}

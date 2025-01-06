import { Request, Response, NextFunction } from "express";
import { APIResponse } from "../models/APIResponse";

export class EarthquakeDataController {
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
    next: NextFunction
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
}

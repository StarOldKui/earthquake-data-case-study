import { NextFunction, Request, Response } from "express";
import { EarthquakeDataStatisticsService } from "../services/EarthquakeDataStatisticsService";
import { validationResult } from "express-validator";
import { APIResponse } from "../models/APIResponse";

export class EarthquakeDataStatisticsController {
  private earthquakeDataStatisticsService: EarthquakeDataStatisticsService;

  constructor() {
    this.earthquakeDataStatisticsService =
      new EarthquakeDataStatisticsService();
  }

  /**
   * Get API request statistics by day
   *
   * @param req - Express Request object
   * @param res - Express Response object
   * @param next - Express NextFunction for error handling
   */
  async getApiRequestStatsByDay(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      // Validate request parameters
      const errors = validationResult(req);
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

      const { reqDate } = req.query;

      // Fetch statistics from service
      const result =
        await this.earthquakeDataStatisticsService.getApiRequestStatsByDay(
          reqDate as string,
        );

      res.status(200).json({
        status: 200,
        success: true,
        message:
          result && Object.keys(result).length > 0
            ? "API request statistics retrieved successfully."
            : "No statistics found for the given date.",
        data: result || {},
      });
    } catch (error) {
      next(error);
    }
  }
}

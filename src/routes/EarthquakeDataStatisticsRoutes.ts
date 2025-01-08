import { NextFunction, Request, Response, Router } from "express";
import { EarthquakeDataStatisticsController } from "../controllers/EarthquakeDataStatisticsController";
import { EarthquakeDataStatisticsValidation } from "../validations/EarthquakeDataStatisticsValidation";

const router = Router();
const earthquakeDataStatisticsController =
  new EarthquakeDataStatisticsController();

/**
 * Define all earthquake-related statistic routes.
 */

/**
 * Get API request statistics by day
 */
router.get(
  "/api-request-count",
  EarthquakeDataStatisticsValidation.validateGetApiRequestStatsByDayInput(),
  (req: Request, res: Response, next: NextFunction) =>
    earthquakeDataStatisticsController.getApiRequestStatsByDay(req, res, next),
);

export default router;

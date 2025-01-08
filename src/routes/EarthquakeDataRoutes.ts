import { NextFunction, Request, Response, Router } from "express";
import { EarthquakeDataController } from "../controllers/EarthquakeDataController";
import { EarthquakeDataValidation } from "../validations/EarthquakeDataValidation";
import { AuthHandler } from "../handlers/AuthHandler";

const router = Router();
const earthquakeDataController = new EarthquakeDataController();

/**
 * Define all earthquake-related routes.
 */

router.get("/fetch-store/mock", AuthHandler.verifyToken, (req, res, next) =>
  earthquakeDataController.mockFetchAndStore(req, res, next),
);

router.get("/fetch-store", AuthHandler.verifyToken, (req, res, next) =>
  earthquakeDataController.fetchAndStore(req, res, next),
);

// Return paginated and filtered earthquake data.
router.get(
  "/",
  AuthHandler.verifyToken,
  EarthquakeDataValidation.validatelistEarthquakesInput(),
  (req: Request, res: Response, next: NextFunction) =>
    earthquakeDataController.listEarthquakes(req, res, next),
);

export default router;

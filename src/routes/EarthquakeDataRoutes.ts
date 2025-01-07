import { Router } from "express";
import { EarthquakeDataController } from "../controllers/EarthquakeDataController";

const router = Router();
const earthquakeDataController = new EarthquakeDataController();

/**
 * Define all earthquake-related routes.
 */

router.get("/fetch-store/mock", (req, res, next) =>
  earthquakeDataController.mockFetchAndStore(req, res, next),
);

router.get("/fetch-store", (req, res, next) =>
  earthquakeDataController.fetchAndStore(req, res, next),
);

/**
 * Return paginated and filtered earthquake data.
 */
router.get("/", (req, res, next) =>
  earthquakeDataController.listEarthquakes(req, res, next),
);

export default router;

import { Router } from "express";
import { AuthController } from "../controllers/AuthController";

const router = Router();
const authController = new AuthController();

/**
 * Define all earthquake-related routes.
 */

// Login
router.post("/login", (req, res, next) => authController.login(req, res, next));

// Refresh token endpoint
router.post("/refresh-token", (req, res, next) =>
  authController.refreshToken(req, res, next),
);

export default router;

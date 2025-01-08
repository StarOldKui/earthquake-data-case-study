import { Request, Response, NextFunction } from "express";
import { JwtUtil } from "../utils/JwtUtil";

/**
 * Middleware handler for authentication and authorization using JWT.
 */
export class AuthHandler {
  /**
   * Middleware to verify JWT token in the request headers.
   *
   * Checks for a valid JWT in the `Authorization` header.
   * If valid, attaches the decoded payload to `req.user` and proceeds to the next middleware.
   * Otherwise, it returns a 401 or 403 error response.
   *
   * @param req - The Express request object.
   * @param res - The Express response object.
   * @param next - The Express next function to pass control to the next middleware.
   */
  static verifyToken(req: Request, res: Response, next: NextFunction): void {
    // Extract token from Authorization header
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : undefined;

    // If no token is provided, return a 401 error
    if (!token) {
      res.status(401).json({
        status: 401,
        success: false,
        message: "Access denied. No token provided.",
      });
      return;
    }

    try {
      // Verify the token using JwtUtil
      const decoded = JwtUtil.verifyToken(token);

      // Attach the decoded payload to req.user for subsequent middleware and route handlers
      (req as any).user = decoded;

      // Proceed to the next middleware or route handler
      next();
    } catch (err) {
      // Handle token verification errors
      res.status(403).json({
        status: 403,
        success: false,
        message: "Invalid or expired token.",
      });
    }
  }
}

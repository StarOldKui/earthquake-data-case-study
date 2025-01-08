import { NextFunction, Request, Response } from "express";
import { AuthService } from "../services/AuthService";
import { APIResponse } from "../models/APIResponse";

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  /**
   * Handles user login and generates Access and Refresh Tokens.
   *
   * @param req - The Express request object.
   * @param res - The Express response object.
   * @param next - The Express next function.
   */
  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { username, password } = req.body;

      // Authenticate the user
      const tokens = this.authService.authenticateUser(username, password);

      const response: APIResponse = {
        status: 200,
        success: true,
        message: "Login successful.",
        data: tokens,
      };

      res.status(200).json(response);
    } catch (error) {
      const response: APIResponse = {
        status: 401,
        success: false,
        message: (error as Error).message,
        data: {},
      };
      res.status(401).json(response);
    }
  }

  /**
   * Handles Access Token refresh using a valid Refresh Token.
   *
   * @param req - The Express request object.
   * @param res - The Express response object.
   * @param next - The Express next function.
   */
  async refreshToken(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        const response: APIResponse = {
          status: 400,
          success: false,
          message: "Refresh Token is required.",
          data: {},
        };
        res.status(400).json(response);
        return;
      }

      // Generate a new Access Token
      const newAccessToken = this.authService.refreshAccessToken(refreshToken);

      const response: APIResponse = {
        status: 200,
        success: true,
        message: "Access Token refreshed successfully.",
        data: { accessToken: newAccessToken },
      };

      res.status(200).json(response);
    } catch (error) {
      const response: APIResponse = {
        status: 403,
        success: false,
        message: (error as Error).message,
        data: {},
      };

      res.status(403).json(response);
    }
  }
}

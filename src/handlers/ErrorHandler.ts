import { Request, Response, NextFunction } from "express";
import { APIResponse } from "../models/APIResponse";

/**
 * Global error handler class.
 * This class provides middleware for handling application-wide errors and ensures
 * consistent error responses in a structured JSON format.
 */
export class ErrorHandler {
  /**
   * Middleware to handle errors within the application.
   * Captures errors passed through the `next()` function or uncaught exceptions,
   * formats them, and sends a structured JSON response to the client.
   *
   * @param err - The error object containing details about the error.
   * @param req - The Express Request object representing the incoming HTTP request.
   * @param res - The Express Response object used to send the response.
   * @param next - The NextFunction to pass control to the next middleware (optional in error handling, but required by Express).
   *
   * @returns A JSON response with the error details.
   *
   * JSON Response Format:
   * - `success`: A boolean indicating whether the request was successful (always `false` for errors).
   * - `message`: A human-readable error message.
   */
  static handleError(
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
  ): void {
    // Default status code for errors
    const status = err.status || 500; // Use 500 (Internal Server Error) if no specific status is provided.    const message = err.message || "Internal Server Error";
    // Error message
    const message = err.message || "Internal Server Error"; // Default message if none is provided.

    // Log the error details (stack trace) for internal debugging
    console.error("Error occurred:", {
      message: err.message,
      stack: err.stack,
      route: req.originalUrl,
    });

    // Send the error response
    const response: APIResponse = {
      status,
      success: false, // Indicates an error occurred
      message, // The error message
      data: null, // No data for errors
    };

    res.status(status).json(response);
  }
}

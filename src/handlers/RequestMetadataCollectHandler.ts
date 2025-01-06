import { Request, Response, NextFunction } from "express";
import { v4 as uuidv4 } from "uuid";
import geoip from "geoip-lite";
import * as moment from "moment-timezone";
import { DynamoDBUtil } from "../utils/DynamoDBUtil";
import { AppConfig } from "../config/appConfig";

/**
 * A handler class for collecting and logging API request metadata.
 */
export class RequestMetadataCollectHandler {
  /**
   * Middleware to log metadata of an API request, including execution time and response data.
   *
   * This middleware intercepts the response to record metadata such as request details,
   * execution time, and response data for logging purposes. Errors occurring during the
   * metadata collection and storage process are logged to the console without affecting
   * the API response, ensuring a smooth user experience. Errors in the API response itself
   * are handled by the global error handler.
   *
   * @param req - The Express Request object.
   * @param res - The Express Response object.
   * @param next - The NextFunction to pass control to the next middleware.
   */
  static async logMetadata(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const startTime = Date.now();

    // Collect metadata from the request
    const requestMetadata =
      RequestMetadataCollectHandler.collectRequestMetadata(req);

    // Save original res.send method
    const originalSend = res.send.bind(res);

    // Override res.send method to capture response data
    res.send = (body: any) => {
      res.locals.responseData = body; // Automatically store response data
      return originalSend(body); // Call original res.send
    };

    // Hook into the response
    res.on("finish", async () => {
      const executionTimeInSecond = ((Date.now() - startTime) / 1000).toFixed(
        2
      );

      const responseData = res.locals.responseData || null;

      const completeAPIlog = {
        ...requestMetadata,
        executionTimeInSecond, // Log in seconds
        responseData,
      };

      console.log("API request log generated:", completeAPIlog);

      try {
        // Store the API request log in the database
        await RequestMetadataCollectHandler.storeLog(completeAPIlog);
      } catch (error) {
        // Log metadata storage errors without impacting the API response
        console.error(
          "Failed to store API request log. This does not affect the response:",
          error
        );
      }
    });

    next();
  }

  /**
   * Collects metadata from an incoming HTTP request.
   *
   * This method gathers information such as timestamps, IP address, geolocation, headers,
   * and query parameters to provide detailed metadata about the API request.
   *
   * @param req - The Express Request object.
   * @returns An object containing request metadata.
   */
  static collectRequestMetadata(req: Request): Record<string, any> {
    // Generate unique request ID
    const reqId = uuidv4();

    // Retrieve the IP address from the request
    const reqIp =
      req.headers["x-forwarded-for"] || req.socket.remoteAddress || "unknown";

    // Lookup geo-location info based on the IP
    const reqGeoLocation =
      reqIp !== "unknown" ? geoip.lookup(reqIp as string) : null;

    // Record timestamps
    const reqTimestamp = Date.now(); // The time the request was received
    const reqReadableTimestampUTC = new Date(reqTimestamp).toISOString(); // Human-readable time in UTC
    const reqReadableTimestampLocal = moment
      .tz(reqTimestamp, "Australia/Melbourne")
      .format("YYYY-MM-DD HH:mm:ss z"); // Human-readable time in local timezone

    return {
      reqId,
      reqTimestamp, // UNIX timestamp in milliseconds
      reqReadableTimestampUTC, // UTC time
      reqReadableTimestampLocal, // Local time (specific timezone)
      reqIp, // The IP address from which the request originated
      reqGeoLocation, // Geo-location info
      reqPath: req.originalUrl, // The original URL path of the request
      reqMethod: req.method, // The HTTP method (e.g., GET, POST)
      reqHeaders: req.headers, // Request headers
      reqQueryParams: req.query, // Query parameters
      reqBody: req.body, // Request body data
    };
  }

  /**
   * Stores the complete API log into the DynamoDB table.
   *
   * This method stores the collected API request metadata into the DynamoDB table
   * specified in the configuration. Any errors are propagated for handling by
   * the calling function.
   *
   * @param completeAPIlog - The API log object to store.
   */
  static async storeLog(completeAPIlog: any): Promise<void> {
    // Directly call `DynamoDBUtil.putItem` and let the error bubble up
    await DynamoDBUtil.putItem(
      AppConfig.AWS.DynamoDB.Tables.EarthquakeApiRequestLog,
      completeAPIlog
    );
  }
}

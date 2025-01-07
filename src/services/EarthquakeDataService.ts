import axios from "axios";
import { AppConfig } from "../config/appConfig";
import { DynamoDBUtil } from "../utils/DynamoDBUtil";
import { EarthquakeResponse } from "../models/EarthquakeDataModel";
import { QueryCommandOutput } from "@aws-sdk/lib-dynamodb";

/**
 * A service class to handle earthquake data operations.
 */
export class EarthquakeDataService {
  /**
   * Fetches earthquake data from the given API and stores the 100 most recent earthquakes in the database.
   *
   * @param apiUrl - The URL of the earthquake data API.
   */
  async fetchAndStoreEarthquakes(apiUrl: string): Promise<void> {
    try {
      // Fetch earthquake data from the USGS API
      console.log(`Fetching earthquake data from: ${apiUrl}`);

      const response = await axios.get<EarthquakeResponse>(apiUrl);

      // Extract the most recent 100 earthquakes
      // The data from the USGS API is already sorted in descending order by time (newest first).
      // This ensures that slicing the first 100 items will give the 100 most recent earthquakes.
      // No additional sorting is necessary as the API guarantees the order
      const earthquakeFeatures = response.data.features
        .slice(0, 100)
        .map((feature) => {
          // Partition Key: Event type (e.g., "earthquake" or "quarry")
          const eventType = feature.properties.type;
          // Sort Key: Event occur timestamp
          const occurrenceTimestamp = feature.properties.time;
          // Store human-readable date
          const occurrenceDate = new Date(occurrenceTimestamp).toISOString();

          return {
            eventType,
            occurrenceTimestamp,
            occurrenceDate,
            ...feature, // All other properties
          };
        });

      console.log(`Fetched ${earthquakeFeatures.length} earthquakes`);

      // Store each earthquake in DynamoDB
      // TODO: add retry logic
      await DynamoDBUtil.batchPutItems(
        AppConfig.AWS.DynamoDB.Tables.EarthquakeData,
        earthquakeFeatures,
      );
    } catch (error) {
      throw new Error(
        `Failed to fetch and store earthquake data. Reason: ${(error as Error).message}`,
      );
    }
  }

  /**
   * Fetches earthquake data with pagination and filters from the database.
   *
   * @param filters - Query parameters including pagination, sorting, and filtering options.
   * @returns Paginated and filtered earthquake data, including:
   *   - `items`: The list of earthquake records for the current page.
   *   - `size`: Number of records in the current page.
   *   - `lastEvaluatedKey`: Key for fetching the next page.
   */
  async getEarthquakes(filters: Record<string, any>): Promise<any> {
    // Build key condition expression
    let keyConditionExpression = "eventType = :eventType";

    // Build non-primary key condition expression
    const filterExpression: string[] = [];

    // ...
    const expressionAttributeValues: Record<string, any> = {
      ":eventType": "earthquake",
    };

    // Parse pagination filters
    const pageSize = parseInt(filters.pageSize, 10);
    const isScanForward = filters.sortOrder === "asc"; // Sorting order

    // Parse occur time filters
    if (filters.occurStartDate && filters.occurEndDate) {
      const startDate = new Date(filters.occurStartDate).getTime();
      const endDate = new Date(filters.occurEndDate).getTime();

      if (!isNaN(startDate) && !isNaN(endDate)) {
        keyConditionExpression +=
          " AND occurrenceTimestamp BETWEEN :startDate AND :endDate";
        expressionAttributeValues[":startDate"] = startDate;
        expressionAttributeValues[":endDate"] = endDate;
      }
    } else if (filters.occurStartDate) {
      const startDate = new Date(filters.occurStartDate).getTime();
      if (!isNaN(startDate)) {
        keyConditionExpression += " AND occurrenceTimestamp >= :startDate";
        expressionAttributeValues[":startDate"] = startDate;
      }
    } else if (filters.occurEndDate) {
      const endDate = new Date(filters.occurEndDate).getTime();
      if (!isNaN(endDate)) {
        keyConditionExpression += " AND occurrenceTimestamp <= :endDate";
        expressionAttributeValues[":endDate"] = endDate;
      }
    }

    // Parse other filters
    if (filters.location !== undefined) {
      filterExpression.push("contains(properties.place, :location)");
      expressionAttributeValues[":location"] = filters.location;
    }
    if (filters.minMagnitude !== undefined) {
      filterExpression.push("properties.mag >= :minMag");
      expressionAttributeValues[":minMag"] = parseFloat(filters.minMagnitude);
    }
    if (filters.maxMagnitude !== undefined) {
      filterExpression.push("properties.mag <= :maxMag");
      expressionAttributeValues[":maxMag"] = parseFloat(filters.maxMagnitude);
    }

    // Build Query Parameters
    const params = {
      TableName: AppConfig.AWS.DynamoDB.Tables.EarthquakeData,
      KeyConditionExpression: keyConditionExpression,
      FilterExpression: filterExpression.length
        ? filterExpression.join(" AND ")
        : undefined,
      ExpressionAttributeValues: expressionAttributeValues,
      Limit: pageSize, // Limit results to page size
      ScanIndexForward: isScanForward, // Ascending/Descending order
      ExclusiveStartKey: filters.lastEvaluatedKey
        ? JSON.parse(filters.lastEvaluatedKey)
        : undefined, // Handle pagination
    };

    console.log(`DynamoDB Query Params:`, params);

    // Perform DynamoDB Query
    const result: QueryCommandOutput = await DynamoDBUtil.queryItems(params);

    // List of items retrieved in this query
    const items = result.Items || [];
    // Number of items in the current page
    const size = items.length;
    // Key for fetching the next page
    const lastEvaluatedKey = result.LastEvaluatedKey || null;

    return {
      items,
      size,
      lastEvaluatedKey,
    };
  }
}

import axios from "axios";
import { AppConfig } from "../config/appConfig";
import { DynamoDBUtil } from "../utils/DynamoDBUtil";
import { EarthquakeResponse } from "../models/EarthquakeDataModel";
import moment from "moment-timezone";

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
          // Original timestamp in milliseconds
          const occurrenceTimestamp = feature.properties.time;
          // Generate "year-month" partition key
          const yearMonth = moment(occurrenceTimestamp).format("YYYY-MM");

          return {
            yearMonth, // Partition Key
            occurrenceTimestamp, // Sort Key
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
   * @param pagination - Pagination details (page and limit).
   * @param filters - Filters for querying the database.
   * @returns Filtered and paginated earthquake data.
   */
  async getEarthquakes(
    pagination: { page: number; limit: number },
    filters: any,
  ): Promise<any> {
    const { page, limit } = pagination;
    const offset = (page - 1) * limit;

    const filterExpression: string[] = [];
    const expressionAttributeValues: Record<string, any> = {};

    // Add filters for minimum and maximum magnitude
    if (filters.minMagnitude) {
      filterExpression.push("properties.mag >= :minMag");
      expressionAttributeValues[":minMag"] = parseFloat(filters.minMagnitude);
    }

    if (filters.maxMagnitude) {
      filterExpression.push("properties.mag <= :maxMag");
      expressionAttributeValues[":maxMag"] = parseFloat(filters.maxMagnitude);
    }

    // Add filters for date range
    if (filters.startDate) {
      filterExpression.push("occurTime >= :occurDateStart");
      expressionAttributeValues[":occurDateStart"] = filters.startDate;
    }

    if (filters.endDate) {
      filterExpression.push("occurTime <= :occurDateEnd");
      expressionAttributeValues[":occurDateEnd"] = filters.endDate;
    }

    // Add filter for location
    if (filters.location) {
      filterExpression.push("contains(properties.place, :location)");
      expressionAttributeValues[":location"] = filters.location;
    }

    // Build the DynamoDB query
    const params = {
      TableName: AppConfig.AWS.DynamoDB.Tables.EarthquakeData,
      FilterExpression: filterExpression.length
        ? filterExpression.join(" AND ")
        : undefined,
      ExpressionAttributeValues: Object.keys(expressionAttributeValues).length
        ? expressionAttributeValues
        : undefined,
      Limit: limit,
      ExclusiveStartKey: offset > 0 ? { id: `id-${offset}` } : undefined,
    };

    // Execute the query
    const result = await DynamoDBUtil.queryItems(params);

    return {
      items: result.items,
      currentPage: page,
      hasNextPage: !!result.lastEvaluatedKey,
    };
  }
}

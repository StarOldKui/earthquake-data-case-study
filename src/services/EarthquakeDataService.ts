import axios from "axios";
import { AppConfig } from "../config/appConfig";
import { DynamoDBUtil } from "../utils/DynamoDBUtil";
import { EarthquakeResponse } from "../models/EarthquakeDataModel";
import * as moment from "moment-timezone";

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
        .map((feature) => ({
          occurTime: moment
            .tz(feature.properties.time, "Australia/Melbourne")
            .format("YYYY-MM-DD HH:mm:ss z"), // Occurrence time (sort key) as Human-readable time in local timezone
          ...feature, // Add the remaining fields as is, already included the partition key 'id'
        }));

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
}

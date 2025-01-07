/**
 * Application configuration and constants.
 * This file centralizes configuration values to avoid hardcoding strings
 * throughout the project and provides a single source of truth.
 */
export const AppConfig = {
  AWS: {
    Region: process.env.AWS_REGION || "ap-southeast-2", // Default AWS region
    DynamoDB: {
      Tables: {
        EarthquakeApiRequestLog: "earthquake-api-request-log-dev", // Table for storing API request logs
        EarthquakeData: "earthquake-data-dev", // Table for storing earthquake data
      },
    },
  },
  EarthquakeAPI: {
    Url: "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson",
  },
};

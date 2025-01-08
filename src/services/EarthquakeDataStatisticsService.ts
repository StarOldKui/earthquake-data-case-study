import { DynamoDBUtil } from "../utils/DynamoDBUtil";

export class EarthquakeDataStatisticsService {
  /**
   * Fetches API request statistics grouped by day and endpoint
   *
   * @param reqDate - The specific date for the statistics (YYYY-MM-DD).
   * @returns A record containing statistics grouped by date and endpoint
   */
  async getApiRequestStatsByDay(
    reqDate: string,
  ): Promise<Record<string, Record<string, number>>> {
    try {
      const params = {
        TableName: "earthquake-api-request-log-dev",
        IndexName: "ReqDateIndex", // GSI for querying by date
        KeyConditionExpression: "reqDate = :reqDate",
        ExpressionAttributeValues: {
          ":reqDate": reqDate,
        },
      };

      console.log(`DynamoDB Query Params:`, params);

      const result = await DynamoDBUtil.queryItems(params);

      if (!result.Items || result.Items.length === 0) {
        console.log(`No data found for date: ${reqDate}`);
        return {};
      }

      // Aggregate API request counts
      return this.aggregateApiRequestStats(result.Items);
    } catch (error) {
      throw new Error(
        `Failed to fetch API request statistics. Reason: ${(error as Error).message}`,
      );
    }
  }

  /**
   * Aggregates API request counts by endpoint for a given date.
   *
   * @param items - List of DynamoDB items from the query result
   * @returns A record containing statistics grouped by endpoint
   */
  private aggregateApiRequestStats(
    items: Record<string, any>[],
  ): Record<string, Record<string, number>> {
    const stats: Record<string, Record<string, number>> = {};

    items.forEach((item) => {
      const reqDate = item.reqDate;
      const endpointName = item.endpointName;

      if (!stats[reqDate]) stats[reqDate] = {};
      stats[reqDate][endpointName] = (stats[reqDate][endpointName] || 0) + 1;
    });

    return stats;
  }
}

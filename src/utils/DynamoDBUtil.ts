import {
  BatchWriteCommand,
  PutCommand,
  QueryCommand,
} from "@aws-sdk/lib-dynamodb";
import { ddbDocClient } from "../config/dynamoDB";

/**
 * A utility class for interacting with DynamoDB.
 * Provides methods for common operations such as inserting and retrieving data.
 */
export class DynamoDBUtil {
  /**
   * Inserts an item into the specified DynamoDB table.
   *
   * @param tableName - The name of the DynamoDB table.
   * @param item - The item to insert into the table.
   * @throws Will throw an error if the operation fails.
   */
  static async putItem(
    tableName: string,
    item: Record<string, any>,
  ): Promise<void> {
    try {
      const params = {
        TableName: tableName,
        Item: item,
      };

      await ddbDocClient.send(new PutCommand(params));

      console.log(`Successfully added item to table: ${tableName}`);
    } catch (error) {
      throw new Error(
        `Failed to insert item into DynamoDB table '${tableName}'. Reason: ${
          (error as Error).message
        }`,
      );
    }
  }

  /**
   * Inserts multiple items into the specified DynamoDB table in a batch operation.
   *
   * @param tableName - The name of the DynamoDB table.
   * @param items - An array of items to insert into the table.
   * @throws Will throw an error if the operation fails.
   */
  static async batchPutItems(
    tableName: string,
    items: Record<string, any>[],
  ): Promise<void> {
    try {
      // DynamoDB BatchWrite allows up to 25 items per request
      const BATCH_SIZE = 25;

      // Split items into chunks of 25
      for (let i = 0; i < items.length; i += BATCH_SIZE) {
        const batch = items.slice(i, i + BATCH_SIZE);

        const params = {
          RequestItems: {
            [tableName]: batch.map((item) => ({
              PutRequest: {
                Item: item,
              },
            })),
          },
        };

        await ddbDocClient.send(new BatchWriteCommand(params));

        console.log(
          `Successfully added ${batch.length} items to table: ${tableName}`,
        );
      }
    } catch (error) {
      throw new Error(
        `Failed to batch insert items into DynamoDB table '${tableName}'. Reason: ${
          (error as Error).message
        }`,
      );
    }
  }

  static async queryItems(params: any): Promise<any> {
    try {
      const result = await ddbDocClient.send(new QueryCommand(params));
      return {
        items: result.Items,
        lastEvaluatedKey: result.LastEvaluatedKey,
      };
    } catch (error) {
      throw new Error(
        `Failed to query items. Reason: ${(error as Error).message}`,
      );
    }
  }
}

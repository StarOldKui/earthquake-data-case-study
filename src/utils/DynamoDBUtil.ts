import { PutCommand, GetCommand } from "@aws-sdk/lib-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { ddbDocClient } from "../config/dynamoDB";
import { NextFunction } from "express";

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
    item: Record<string, any>
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
        }`
      );
    }
  }
}

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

/**
 * Initializes and exports two DynamoDB clients:
 * - `DynamoDBClient`: Low-level client for raw DynamoDB operations.
 * - `DynamoDBDocumentClient`: High-level abstraction for easier use with JavaScript/TypeScript objects.
 */

// Define the AWS region (default to 'ap-southeast-2' if not specified)
const REGION = process.env.AWS_REGION || "ap-southeast-2";

/**
 * Low-level DynamoDB Client.
 *
 * This client provides direct access to the DynamoDB API and requires
 * manual handling of data marshalling/unmarshalling (e.g., converting
 * JavaScript objects to DynamoDB AttributeValue format and vice versa).
 *
 * Use this for fine-grained control over DynamoDB operations.
 */
const ddbClient = new DynamoDBClient({
  region: REGION,
});

/**
 * High-level DynamoDB Document Client.
 *
 * This client simplifies interaction with DynamoDB by abstracting
 * the data marshalling/unmarshalling process.
 * It allows you to work directly with JavaScript/TypeScript objects
 * without manually converting to/from DynamoDB's AttributeValue format.
 *
 * Use this for most use cases where simplicity is preferred.
 */
const ddbDocClient = DynamoDBDocumentClient.from(ddbClient);

export { ddbClient, ddbDocClient };

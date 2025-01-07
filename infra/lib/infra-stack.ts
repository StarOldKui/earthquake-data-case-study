import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { AttributeType, Table, BillingMode } from "aws-cdk-lib/aws-dynamodb";

/**
 * Infrastructure stack for provisioning AWS resources.
 * This stack defines:
 * 1. A table for storing earthquake data.
 * 2. A table for logging API requests related to earthquake data.
 */
export class InfraStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    /**
     * DynamoDB table for storing earthquake data.
     * This table is used to store the details of earthquakes, including their occurrence time.
     *
     * Table schema:
     * - Partition Key (`id`): Unique identifier for each earthquake (e.g., an earthquake ID).
     * - Sort Key (`occurTime`): Timestamp of when the earthquake occurred, in milliseconds.
     * - Billing Mode: Pay-per-request to optimize cost for variable workloads.
     * - Removal Policy: Destroy the table when the stack is deleted (suitable for non-production environments).
     */
    const earthquakeTable = new Table(this, "EarthquakeDataTable", {
      tableName: "earthquake-data-dev",
      partitionKey: {
        name: "id", // Unique identifier for the earthquake
        type: AttributeType.STRING,
      },
      sortKey: {
        name: "occurTime", // Timestamp of the earthquake occurrence
        type: AttributeType.STRING,
      },
      billingMode: BillingMode.PAY_PER_REQUEST, // on-demand cost
      removalPolicy: cdk.RemovalPolicy.DESTROY, // Automatically delete table with stack
    });

    /**
     * DynamoDB table for storing API request logs.
     * This table is used to log metadata about API requests made to interact with the earthquake data.
     *
     * Table schema:
     * - Partition Key (`reqId`): Unique identifier for each API request (e.g., UUID or user session ID).
     * - Sort Key (`reqTimestamp`): Timestamp of when the request was made, in milliseconds.
     * - Billing Mode: Pay-per-request to handle fluctuating traffic patterns.
     * - Removal Policy: Destroy the table when the stack is deleted (suitable for non-production environments).
     */
    const earthquakeAPIRequestLogTable = new Table(
      this,
      "EarthquakeAPIRequestLogTable",
      {
        tableName: "earthquake-api-request-log-dev",
        partitionKey: {
          name: "reqId", // Unique identifier for each API request
          type: AttributeType.STRING,
        },
        sortKey: {
          name: "reqTimestamp", // Timestamp of the request made
          type: AttributeType.NUMBER,
        },
        billingMode: BillingMode.PAY_PER_REQUEST, // on-demand cost
        removalPolicy: cdk.RemovalPolicy.DESTROY, // Automatically delete table with stack
      },
    );
  }
}

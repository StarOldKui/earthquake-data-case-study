import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { AttributeType, BillingMode, Table } from "aws-cdk-lib/aws-dynamodb";

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
     *
     * Table Schema:
     * - Partition Key (`yearMonth`): Represents the year and month of the earthquake occurrence, e.g., "2025-01".
     * - Sort Key (`occurrenceTimestamp`): The timestamp of when the earthquake occurred.
     *
     * Key Considerations:
     * - Partition Key (`yearMonth`) is designed for grouping data by month to ensure partitions are neither too small nor too large.
     * - Sort Key (`occurrenceTimestamp`) supports efficient range queries and sorting by time within each partition.
     * - Use of a numeric timestamp for the sort key minimizes storage size and ensures precision for range queries.
     *
     * Additional Features:
     * - Billing Mode: Pay-per-request to optimize cost for unpredictable or variable workloads.
     * - Removal Policy: The table will be destroyed when the stack is deleted (suitable for non-production environments).
     */
    const earthquakeTable = new Table(this, "EarthquakeDataTable", {
      tableName: "earthquake-data-dev",
      partitionKey: {
        name: "yearMonth",
        type: AttributeType.STRING,
      },
      sortKey: {
        name: "occurrenceTimestamp",
        type: AttributeType.NUMBER,
      },
      billingMode: BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    /**
     * DynamoDB table for storing API request logs.
     * This table is used to log metadata about API requests made to interact with the earthquake data.
     *
     * Table Schema:
     * - Partition Key (`yearMonth`): Represents the year and month of the API request, e.g., "2025-01".
     * - Sort Key (`reqTimestamp`): The timestamp of when the request was made.
     *
     * Additional Features:
     * - Billing Mode: Pay-per-request to optimize cost for unpredictable or variable workloads.
     * - Removal Policy: The table will be destroyed when the stack is deleted (suitable for non-production environments).
     */
    const earthquakeAPIRequestLogTable = new Table(
      this,
      "EarthquakeAPIRequestLogTable",
      {
        tableName: "earthquake-api-request-log-dev",
        partitionKey: {
          name: "yearMonth",
          type: AttributeType.STRING,
        },
        sortKey: {
          name: "reqTimestamp",
          type: AttributeType.NUMBER,
        },
        billingMode: BillingMode.PAY_PER_REQUEST,
        removalPolicy: cdk.RemovalPolicy.DESTROY,
      },
    );
  }
}

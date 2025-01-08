import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import {
  AttributeType,
  BillingMode,
  ProjectionType,
  Table,
} from "aws-cdk-lib/aws-dynamodb";

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
     * - Partition Key (`eventType`): Represents the type of seismic event, e.g., "earthquake" or "quarry".
     * - Sort Key (`occurrenceTimestamp`): The timestamp of when the earthquake occurred.
     *
     * Additional Features:
     * - Billing Mode: Pay-per-request to optimize cost for unpredictable or variable workloads.
     * - Removal Policy: The table will be destroyed when the stack is deleted (suitable for non-production environments).
     */
    const earthquakeTable = new Table(this, "EarthquakeDataTable", {
      tableName: "earthquake-data-dev",
      partitionKey: {
        name: "eventType",
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
     * - Partition Key (`endpointName`) ensures logs are grouped by API endpoint for easier tracking and analysis.
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
          name: "endpointName",
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

    earthquakeAPIRequestLogTable.addGlobalSecondaryIndex({
      indexName: "ReqDateIndex", // Name of the GSI for querying logs by date
      partitionKey: {
        name: "reqDate", // Partition Key: The date of the request in "YYYY-MM-DD" format
        type: AttributeType.STRING,
      },
      sortKey: {
        name: "reqTimestamp",
        type: AttributeType.NUMBER,
      },
      projectionType: ProjectionType.ALL,
    });
  }
}

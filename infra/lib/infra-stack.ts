import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { AttributeType, Table, BillingMode } from 'aws-cdk-lib/aws-dynamodb';


export class InfraStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Build the DynamoDB table for storing eatrhquake data
    const earthquakeTable = new Table(this, 'EarthquakeDataTable', {
      tableName: 'earthquake-data-dev',
      partitionKey: {
        name: 'id',
        type: AttributeType.STRING,
      },
      sortKey: {
        name: 'occurTime',
        type: AttributeType.NUMBER,
      },
      billingMode: BillingMode.PAY_PER_REQUEST, // on-demand cost
      removalPolicy: cdk.RemovalPolicy.DESTROY, // Automatically delete table with stack
    });

    // Build the DynamoDB table for storing api requests to the eatrhquake data
    const earthquakeAPIRequestLogTable = new Table(this, 'EarthquakeAPIRequestLogTable', {
      tableName: 'earthquake-api-request-log-dev',
      partitionKey: {
        name: 'id',
        type: AttributeType.STRING,
      },
      billingMode: BillingMode.PAY_PER_REQUEST, // on-demand cost
      removalPolicy: cdk.RemovalPolicy.DESTROY, // Automatically delete table with stack
    });
  }
}

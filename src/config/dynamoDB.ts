// // src/config/dynamoDB.ts
// import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
// import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

// const REGION = process.env.AWS_REGION || 'us-east-1'; // 示例

// // 原始 DynamoDB Client
// const ddbClient = new DynamoDBClient({
//   region: REGION,
//   // 如果你要连接本地 DynamoDB，可以添加
//   // endpoint: 'http://localhost:8000'
// });

// // Document Client，简化了操作
// const ddbDocClient = DynamoDBDocumentClient.from(ddbClient);

// export { ddbClient, ddbDocClient };

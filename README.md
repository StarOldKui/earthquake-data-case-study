# About Me

**Name**: Alen Xia  
**Email**: staroldkui@gmail.com

# Introduction

The application will integrate this API to fetch earthquake data:
https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson

# Notice

1. **Project Walkthrough**:
    - To help you understand the project thoroughly, I have recorded a detailed demo video explaining the entire project
      workflow.
    - You can watch the walkthrough on Google
      Drive: [Project Demo Video](https://drive.google.com/file/d/1Hd-_ulK6aNtsuxZ_RSyhVVI2qKV7xmfb/view?usp=sharing).

2. **Postman API Collection**:
    - The API endpoints have been exported as a Postman collection for easy testing.
    - You can find the exported JSON file in the `docs` directory. Simply import it into Postman to start making API
      calls.

# Features

- Fetch and store the 100 most recent earthquakes.
- Paginated and filterable listing of earthquakes from the database.
- Collect metadata for every API request, including timestamps, request body, headers, and execution details.
- Query API request statistics by date.
- Secure access to endpoints with JWT-based authentication.
- Fully documented using OpenAPI 3.0 specification.

# Technologies Used

- **Language**: Node.js, TypeScript
- **Framework**: Express.js
- **Database**: AWS DynamoDB
- **Authentication**: JWT (JSON Web Tokens)
- **Documentation**: OpenAPI (Swagger)

# Project Structure

```plaintext
.
├── docs/                   # Contain documentation Files
├── contract/               # OpenAPI Specification Files
├── dist/                   # Compiled TypeScript Output
├── infra/                  # AWS Infrastructure Code (CDK)
├── node_modules/           # Node.js Dependencies
├── src/
│   ├── config/             # Configuration Files (e.g., appConfig)
│   ├── controllers/        # Controller Logic for Each Endpoint
│   ├── handlers/           # Custom Middleware and Handlers
│   ├── models/             # Data Models and Interfaces
│   ├── routes/             # API Route Definitions
│   ├── services/           # Business Logic and Database Operations
│   ├── utils/              # Utility Functions
│   ├── validations/        # Validation Logic for Requests
│   └── index.ts            # Entry Point of the Application
├── tests/                  # Test Files and Scripts
├── jest.config.js          # Jest Configuration File for Unit and Integration Tests
├── package.json            # Project Dependencies and Scripts
├── tsconfig.json           # TypeScript Configuration
└── README.md               # Project Documentation
```

# Installation

## Prerequisites

- **Node.js**: Version 16.x or later.
- **AWS Account**: Ensure you have sufficient permissions to manage DynamoDB resources.
- **AWS CLI**: Installed and configured for your account.
- **Postman** or **curl**: For API testing.

## Configure AWS Credential on Local

Before deploying resources or running the application, ensure your AWS CLI is configured properly.

### Check Current AWS CLI Configuration

Run the following command to verify:

```bash
aws configure
```

Verify the setup is correct:

```bash
aws sts get-caller-identity
```

## Deploying AWS Resources with CDK

This project uses AWS CDK for infrastructure as code. While manual deployment is supported, it is recommended to use
CI/CD pipelines like AWS CodePipeline or GitHub Actions for automated deployments.

### Install AWS CDK

#### Ensure AWS CDK is installed on your system:

```bash
npm install -g aws-cdk
```

### Execute CDK Bootstrap

If this is the first time deploying CDK resources in your AWS account and region, bootstrap the environment:

```bash
npx cdk bootstrap aws://<AWS_ACCOUNT_ID>/ap-southeast-2
```

### Compile and Deploy AWS Resources

Navigate to the `/infra` directory and run:

```bash
npm run build-deploy
```

This will deploy all necessary resources to AWS, such as the DynamoDB tables.

# Running the Application

Install dependencies:

```bash
npm install
```

To start the application locally:

```bash
npm run dev
```

# Test the application

To test the application locally:

```bash
npm run test
```

# Design Approach

## Modular Design and Responsibilities

To ensure code clarity and maintainability, the project is divided into the following modules, with each module
responsible for specific functionalities:

1. **`config/`**:
    - Manages global configuration files such as application settings and AWS-related parameters.
    - `appConfig.ts`: Provides constants for JWT secrets, DynamoDB table names, and other settings.
    - `dynamoDB.ts`: Initializes the AWS DynamoDB client and provides basic encapsulation for DynamoDB operations.

2. **`controllers/`**:
    - Handles core logic for each API, decoupling request handling from implementation details for easier extensibility.
    - `AuthController.ts`: Manages user authentication, such as login and JWT issuance.
    - `EarthquakeDataController.ts`: Handles earthquake-related operations, including fetching recent data, pagination,
      and filtering.
    - `EarthquakeDataStatisticsController.ts`: Provides APIs for querying statistics, such as the daily count of API
      calls.

3. **`handlers/`**:
    - Contains middleware and shared logic to ensure reusability.
    - `AuthHandler.ts`: Middleware for JWT authentication.
    - `ErrorHandler.ts`: Centralized error handling and response formatting.
    - `RequestMetadataCollectHandler.ts`: Logs metadata such as request time, execution time, and parameters.

4. **`models/`**:
    - Defines data models and interfaces to standardize data structures.
    - `APIResponse.ts`: Standardized structure for API responses.
    - `EarthquakeDataModel.ts`: Defines the schema for storing earthquake data in DynamoDB.

5. **`routes/`**:
    - Defines API routes and maps them to the corresponding controllers.
    - `AuthRoutes.ts`: Handles routes related to user authentication.
    - `EarthquakeDataRoutes.ts`: Defines routes for earthquake data operations.
    - `EarthquakeDataStatisticsRoutes.ts`: Handles routes for statistics APIs.

6. **`services/`**:
    - Encapsulates business logic and complex operations for better reusability.
    - `AuthService.ts`: Provides JWT issuance and user authentication services.
    - `EarthquakeDataService.ts`: Fetches earthquake data from external APIs and stores it in DynamoDB.
    - `EarthquakeDataStatisticsService.ts`: Handles statistics calculations, such as API request counts.

7. **`utils/`**:
    - Contains utility functions for enhancing code reusability.
    - `DynamoDBUtil.ts`: Provides helper functions for DynamoDB, such as batch writing and pagination.
    - `JwtUtil.ts`: Utility functions for encrypting and decrypting JWT tokens.

8. **`validations/`**:
    - Centralizes request parameter validation logic.
    - `EarthquakeDataValidation.ts`: Validates input for earthquake-related APIs.
    - `EarthquakeDataStatisticsValidation.ts`: Validates input for statistics-related APIs.

9. **`tests/`**:
    - Contains all unit tests and integration tests to ensure code correctness.

10. **`app.ts`**:
    - The main application entry point that initializes the Express application, loads middleware, routes, and global
      error handling.

## AWS CDK for Resource Management

AWS resources are defined using AWS CDK, which is integrated into the project and organized under the `infra/`
directory:

1. **Standalone Subproject**:
    - The `infra` directory is initialized as an independent infrastructure module using the `cdk init` command.
    - This design keeps the infrastructure code modular and maintainable, allowing the infrastructure to be managed
      independently of the application code.

2. **Deployment Script**:
    - A custom `build-deploy` script was created to compile and deploy CDK resources. This script automates
      infrastructure deployment and ensures consistent provisioning.
    - Prerequisite: AWS CLI and CDK must be properly configured locally.
    - While manual deployment was used for this project, in real-world scenarios, CI/CD pipelines (e.g., AWS
      CodePipeline, Github Actions) should be used to automate the deployment process.

## Data Storage and Design Trade-offs

**DynamoDB Table Design**:

Two DynamoDB tables were designed to meet the requirements:

- **`earthquake-data-dev` Table**:
    - Partition Key: `eventType` (e.g., "earthquake").
    - Sort Key: `occurrenceTimestamp` (timestamp of the event).
    - Designed for storing time-series earthquake data, where each event can be categorized and retrieved
      chronologically.

- **`earthquake-api-request-log-dev` Table**:
    - Partition Key: `endpointName` (API endpoint name).
    - Sort Key: `reqTimestamp` (request timestamp).
    - Includes a Global Secondary Index (GSI):
        - Partition Key: `reqDate` (e.g., "YYYY-MM-DD").
        - Sort Key: `reqTimestamp`.
        - Purpose: Enables efficient querying of request logs by date for analytics.
    - Optimized for logging metadata about API requests for monitoring and debugging.

1. **Advantages**:
    - High throughput and scalability, making it suitable for real-time data ingestion and retrieval.
    - Pay-per-request billing model, which is cost-efficient for unpredictable workloads.

2. **Limitations**:
    - DynamoDB is not ideal for complex analytical queries (e.g., aggregations, JOIN operations), which are common for
      data like earthquakes requiring filtering and cross-partition analysis.
    - For example, filtering earthquakes by date, magnitude, and location would require multiple queries or additional
      indexes, which increases complexity and cost.


3. **Challenges**:
    - Storing earthquake data in DynamoDB:
        - Initially, the partition key was designed as `year-month`, which caused inefficiency in querying data
          across multiple partitions (e.g., retrieving earthquake data for a year required querying 12
          partitions).
        - Updated the design to use `eventType` and `occurrenceTimestamp` to simplify cross-partition queries
          and support filtering.
        - While it is effective for real-time ingestion of earthquake data, it is less efficient for analytical queries
          or cross-partition pagination.
        - DynamoDB pagination is limited to within a single partition. And make it vert hard to see if there is a next
          page.
        - DynamoDB lacks native support for aggregations, making tasks such as calculating the average magnitude of
          earthquakes over a month difficult.


4. **Why MySQL or Redshift Would Be Better**:
    - MySQL allows complex queries (e.g., filtering, sorting, and aggregations) across large datasets with ease.
    - Redshift provides fast querying and analytical capabilities for large-scale data.
    - While DynamoDB is excellent for high-throughput, real-time ingestion, its limitations in analytical querying and
      pagination make it less suitable for storing and analyzing earthquake data. A hybrid approach that combines
      DynamoDB for real-time ingestion and MySQL or Redshift for querying and analytics would provide the best balance
      between performance and flexibility.

## System Scalability and Performance Optimization

To handle high traffic scenarios (500 requests per second):

1. **Containerization with Docker**:
    - Package the application as a **Docker image** to ensure portability and consistency across environments.
    - Use the existing Node.js application (`npm start`) as the entry point in the Docker container.
    - Store the Docker image in a container registry (e.g., Amazon Elastic Container Registry, ECR).

2. **Horizontal Scaling with ECS**:
    - Deploy the Docker containers to **Amazon ECS (Elastic Container Service)** with Fargate as the serverless compute
      option or EC2 for more control over scaling.
    - Configure **auto-scaling** policies in ECS to dynamically adjust the number of container instances based on CPU or
      memory usage, or based on the number of incoming requests.

3. **Others**:
    - Use **Amazon SQS** or **Amazon Kinesis** to decouple the processing of incoming requests:
        - Queue incoming requests in SQS, allowing the backend to process them asynchronously.
        - For real-time streaming analytics, use Kinesis to capture and process data at scale.

## Future Improvements

1. **Enhance OpenAPI Documentation**:
    - Fully document all endpoints, including request/response examples, error codes, and authentication details.
2. **Improve Test Coverage**:
    - Add unit and integration tests for all APIs, services, and utilities.
    - Include tests for JWT authentication, DynamoDB access, and parameter validation.
3. **Integrate CI/CD Pipelines**:
    - Automate deployment of application and CDK resources using AWS CodePipeline or GitHub Actions.
4. **Optimize DynamoDB Partitioning**:
    - Experiment with more efficient partitioning strategies to reduce query complexity and improve performance.
5. **Explore Data Analysis Tools**:
    - Use AWS Glue or Redshift for analytics to overcome DynamoDB's limitations in aggregation and time-series analysis.




































export const UTF_8 = "utf-8";
export const AWS_SDK = "aws-sdk";
export const handler: string = "main";
export const region: string = "us-west-2";
export const appName: string = "aws-sdk-app";

export const FUN_LABEL: string = ":function:";
export const ARN_LABEL: string = "arn:aws:lambda:";
export const BASE_PATH: string = "/../src/lambda";
export const CREATE_LAMBDA_URL: string = "createLambdaUrl";
export const QUERY_LAMBDA_URL: string = "queryLambdaUrl";

export const CREATE_LAMBDA_PATH: string = `${BASE_PATH}/createLambda.ts`;
export const QUERY_LAMBDA_PATH: string = `${BASE_PATH}/queryLambda.ts`;

export enum LambdaRole {
  NAME = "private-lambda-access-role",
  ACTIONS = "lambda:InvokeFunction",
  SERVICE_PRINCIPAL = "lambda.amazonaws.com",
}

export enum LambdaType {
  CREATE_LAMBDA = "create-lambda",
  QUERY_LAMBDA = "query-lambda",
}

/**** RDS Constants */
export const RDS_DB_NAME = "apps";
export const RDS_DB_USER = "admin";
export const RDS_DB_PASSWORD = "admin123456";
export const RDS_ENDPOINT = "endpoint";

export const RDS_INSTANCE_ID = `${appName}-public-db`;
export const RDS_INSTANCE_NAME = `${appName}-public-db-rds`;
export const RDS_VPC_ID = `${appName}-public-rds-vpc`;
export const RDS_SUBNET_NAME = `${appName}-public-subnet`;
export const RDS_SECURITY_GROUP_ID = `${appName}-public-rds-sg`;
export const RDS_SECURITY_GROUP_NAME = `${appName}PublicRdsSG`;
export const RDS_SG_ALLOW_TCP = "allow TCP access from anywhere";

/*** S3 Bucket */
export const S3_BUCKET_NAME = "sdk-bucket-create";
export const S3_BUCKET_ARN = "s3-bucket-arn";
export const S3_BUCKET_ID = `${appName}-sdk-bucket-create`;

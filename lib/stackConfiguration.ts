export const UTF_8 = "utf-8";
export const AWS_SDK = "aws-sdk";
export const handler: string = "main";
export const region: string = "us-west-2";
export const appName: string = "aws-sdk-app";

export const FUN_LABEL: string = ":function:";
export const ARN_LABEL: string = "arn:aws:lambda:";
export const BASE_PATH: string = "/../src/lambda";
export const S3_LAMBDA_URL: string = "s3LambdaUrl";
export const RDS_LAMBDA_URL: string = "rdsLambdaUrl";

export const S3_LAMBDA_PATH: string = `${BASE_PATH}/s3Lambda.ts`;
export const RDS_LAMBDA_PATH: string = `${BASE_PATH}/rdsLambda.ts`;

export enum LambdaRole {
  NAME = "private-lambda-access-role",
  ACTIONS = "lambda:InvokeFunction",
  SERVICE_PRINCIPAL = "lambda.amazonaws.com",
}

export enum LambdaType {
  S3_LAMBDA = "s3-lambda",
  RDS_LAMBDA = "rds-lambda",
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
export const S3_BUCKET_NAME = "s3-bucket";
export const S3_BUCKET_ARN = "s3-bucket-arn";
export const S3_BUCKET_ID = `${appName}-app-details-bucket`;

export const S3_PRINCIPAL = "*";
export const S3_GET_OBJECT = "s3:GetObject";
export const S3_PUT_OBJECT = "s3:PutObject";
export const S3_DELETE_OBJECT = "s3:DeleteObject";

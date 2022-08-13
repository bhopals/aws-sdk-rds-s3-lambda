/* eslint-disable @typescript-eslint/require-await */
import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";
import {
  appName,
  RDS_INSTANCE_ID,
  RDS_INSTANCE_NAME,
  S3_BUCKET_NAME,
} from "../../lib/stackConfiguration";
import {
  RDSClient,
  DescribeDBInstancesCommand,
  CreateDBInstanceCommand,
  CreateDBInstanceCommandInput,
} from "@aws-sdk/client-rds";

import {
  S3Client,
  CreateBucketCommand,
  ListBucketsCommand,
} from "@aws-sdk/client-s3";

export async function main(
  event: APIGatewayProxyEventV2,
  context: any
): Promise<APIGatewayProxyResultV2> {
  console.log(event);
  console.log(context);

  console.log("process.env>", process.env);

  const sqlConfig = {
    user: process.env.userName,
    password: process.env.password,
    database: process.env.databaseName,
    host: process.env.endpoint,
  };

  let response = {} as any;

  try {
    /*** S3 Client initialization ***/
    // Create a bucketconst s3Client = new S3Client({});

    /*** S3 List All Buckets */
    // let s3ListResponse = await s3Client.send(new ListBucketsCommand({}));
    // const existingS3 =
    //   (s3ListResponse &&
    //     s3ListResponse.Buckets &&
    //     s3ListResponse.Buckets.map((bucket) => bucket.Name)) ||
    //   [];

    /*** S3 Create a Bucket */
    // const newS3Bucket = `${appName}-${S3_BUCKET_NAME}-${Date.now()}`;
    // const s3CreatResponse = await s3Client.send(
    //   new CreateBucketCommand({
    //     Bucket: newS3Bucket,
    //   })
    // );

    /*** RDS Client initialization ***/
    const rdsClient = new RDSClient({});

    /*** RDS List All Instances */
    // const rdsListResponse = await rdsClient.send(
    //   new DescribeDBInstancesCommand({})
    // );
    // console.log("rdsListResponse>", rdsListResponse);
    // const existingRds =
    //   (rdsListResponse &&
    //     rdsListResponse.DBInstances &&
    //     rdsListResponse.DBInstances.map((rds) => rds)) ||
    //   [];

    /*** RDS Create a new Instaces */
    const newRdsInstanceId = `${RDS_INSTANCE_ID}-${Date.now()}`;
    const rdsCreateResponse = await rdsClient.send(
      new CreateDBInstanceCommand({
        Engine: "mysql",
        AllocatedStorage: 21,
        EngineVersion: "8.0.28",
        PubliclyAccessible: true,
        DBInstanceClass: "db.t2.micro",
        DBName: process.env.databaseName,
        DBInstanceIdentifier: newRdsInstanceId,
        MasterUsername: process.env.userName,
        MasterUserPassword: process.env.password,
      })
    );
    console.log("rdsCreateResponse>", rdsCreateResponse);

    // response = {
    //   body: JSON.stringify({
    //     existingS3,
    //     existingRds,
    //     newS3Bucket,
    //     newRdsInstance: `Database instance(${newRdsInstanceId}) creation is triggered. Please check after 5-10 mins.`,
    //     metadata: {
    //       s3ListResponse,
    //       s3CreatResponse,
    //       rdsListResponse,
    //       rdsCreateResponse,
    //     },
    //   }),
    //   statusCode: 200,
    // };
    response = {
      body: JSON.stringify({
        newRdsInstance: `Database instance(${newRdsInstanceId}) creation is triggered. Please check after 5-10 mins.`,
        metadata: {
          rdsCreateResponse,
        },
      }),
      statusCode: 200,
    };
  } catch (err) {
    console.log("ERR>", err);
    response = {
      body: JSON.stringify({
        err,
      }),
      statusCode: 500,
    };
  }

  console.log(response);
  return response;
}

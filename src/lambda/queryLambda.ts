/* eslint-disable @typescript-eslint/require-await */
import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";
// import { RDSClient, DescribeDBInstancesCommand } from "@aws-sdk/client-rds";
import {
  S3Client,
  ListBucketsCommand,
  CreateBucketCommand,
} from "@aws-sdk/client-s3";
import { appName, S3_BUCKET_NAME } from "../../lib/stackConfiguration";

export async function main(
  event: APIGatewayProxyEventV2,
  context: any
): Promise<APIGatewayProxyResultV2> {
  let response = {} as any;
  try {
    const s3Client = new S3Client({});
    /*** S3 Create a Bucket */
    const newS3Bucket = `${appName}-${S3_BUCKET_NAME}-${Date.now()}`;
    const s3CreatResponse = await s3Client.send(
      new CreateBucketCommand({
        Bucket: newS3Bucket,
      })
    );

    /*** S3 List All Buckets */
    let s3ListResponse = await s3Client.send(new ListBucketsCommand({}));
    const s3List =
      (s3ListResponse &&
        s3ListResponse.Buckets &&
        s3ListResponse.Buckets.map((bucket) => bucket.Name)) ||
      [];

    /*** RDS List All Instances */
    // const rdsListResponse = await new RDSClient({}).send(
    //   new DescribeDBInstancesCommand({})
    // );
    // const rdsList =
    //   (rdsListResponse &&
    //     rdsListResponse.DBInstances &&
    //     rdsListResponse.DBInstances.map((rds) => rds)) ||
    //   [];

    response = {
      body: JSON.stringify({
        s3List,
        metadata: {
          newS3Bucket,
          s3CreatResponse,
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

/* eslint-disable @typescript-eslint/require-await */
import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";
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
    /*** 1. S3 Create Lambda Client */
    const s3Client = new S3Client({});

    /*** 2. S3 Create a Bucket */
    const newS3Bucket = `${appName}-${S3_BUCKET_NAME}-${Date.now()}`;
    const s3CreateResponse = await s3Client.send(
      new CreateBucketCommand({
        Bucket: newS3Bucket,
      })
    );

    /*** 3. S3 List All Buckets */
    let s3ListResponse = await s3Client.send(new ListBucketsCommand({}));
    const s3List =
      (s3ListResponse &&
        s3ListResponse.Buckets &&
        s3ListResponse.Buckets.map((bucket) => bucket.Name)) ||
      [];
    response = {
      body: JSON.stringify({
        LENGTH: s3List.length,
        s3List,
        newS3Bucket,
        metadata: {
          s3ListResponse,
          s3CreateResponse,
        },
      }),
      statusCode: 200,
    };
  } catch (err) {
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

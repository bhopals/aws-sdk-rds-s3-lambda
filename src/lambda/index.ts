/* eslint-disable @typescript-eslint/require-await */
import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";
import {
  appName,
  LambdaType,
  INVOCATION_TYPE,
  UTF_8,
  S3_BUCKET_NAME,
} from "../../lib/stackConfiguration";

import { S3Client, CreateBucketCommand } from "@aws-sdk/client-s3";

export async function main(
  event: APIGatewayProxyEventV2,
  context: any
): Promise<APIGatewayProxyResultV2> {
  console.log(event);
  console.log(context);

  const sqlConfig = {
    user: process.env.userName,
    password: process.env.password,
    database: process.env.databaseName,
    host: process.env.endpoint,
  };

  let response = {} as any;
  try {
    // CREATE S3 Bucket using AWS SDK
    const client = new S3Client({});
    const createCommand = new CreateBucketCommand({
      Bucket: `${S3_BUCKET_NAME}-${Date.now()}`,
    });
    const s3Create = await client.send(createCommand);
    console.log("s3Create>>>", s3Create);

    //CREATE RDS MySql Instance using AWS SDK

    response = {
      body: JSON.stringify({
        s3Create,
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

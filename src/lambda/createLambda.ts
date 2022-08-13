/* eslint-disable @typescript-eslint/require-await */
import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";
import { RDS_INSTANCE_ID } from "../../lib/stackConfiguration";
import {
  RDSClient,
  CreateDBInstanceCommand,
  DescribeDBInstancesCommand,
} from "@aws-sdk/client-rds";

export async function main(
  event: APIGatewayProxyEventV2,
  context: any
): Promise<APIGatewayProxyResultV2> {
  const sqlConfig = {
    user: process.env.userName,
    password: process.env.password,
    database: process.env.databaseName,
    host: process.env.endpoint,
  };

  let response = {} as any;

  try {
    /*** RDS Create a new Instaces */
    const newRdsInstanceId = `${RDS_INSTANCE_ID}-${Date.now()}`;
    const rdsCreateResponse = await new RDSClient({}).send(
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
        BackupRetentionPeriod: 0,
      })
    );

    /*** RDS List All Instances */
    const rdsListResponse = await new RDSClient({}).send(
      new DescribeDBInstancesCommand({})
    );
    const rdsList =
      (rdsListResponse &&
        rdsListResponse.DBInstances &&
        rdsListResponse.DBInstances.map((rds) => rds)) ||
      [];

    console.log("rdsCreateResponse>", rdsCreateResponse);
    response = {
      body: JSON.stringify({
        newRdsInstance: `Database instance(${newRdsInstanceId}) creation is triggered. Please check after 5-10 mins.`,
        metadata: {
          rdsList,
          rdsCreateResponse,
        },
      }),
      statusCode: 200,
    };
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

import * as path from "path";
import * as cdk from "aws-cdk-lib";
import * as lambda from "aws-cdk-lib/aws-lambda";
import { CfnOutput, Aws, SecretValue } from "aws-cdk-lib";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import {
  Role,
  ServicePrincipal,
  PolicyStatement,
  ManagedPolicy,
  Effect,
  AnyPrincipal,
} from "aws-cdk-lib/aws-iam";

import {
  LambdaType,
  LambdaRole,
  handler,
  appName,
  AWS_SDK,
  FUN_LABEL,
  ARN_LABEL,
  RDS_DB_NAME,
  RDS_DB_USER,
  RDS_DB_PASSWORD,
  RDS_SG_ALLOW_TCP,
  RDS_VPC_ID,
  RDS_INSTANCE_ID,
  RDS_INSTANCE_NAME,
  RDS_SECURITY_GROUP_ID,
  RDS_SECURITY_GROUP_NAME,
  RDS_SUBNET_NAME,
  RDS_LAMBDA_PATH,
  S3_LAMBDA_PATH,
  S3_LAMBDA_URL,
  RDS_LAMBDA_URL,
  S3_BUCKET_ID,
  S3_DELETE_OBJECT,
  S3_PUT_OBJECT,
  S3_PRINCIPAL,
  S3_GET_OBJECT,
} from "./stackConfiguration";
import {
  Vpc,
  SubnetType,
  InstanceClass,
  InstanceSize,
  InstanceType,
  Peer,
  Port,
  SecurityGroup,
} from "aws-cdk-lib/aws-ec2";
import {
  DatabaseInstance,
  DatabaseInstanceEngine,
  MysqlEngineVersion,
  Credentials,
} from "aws-cdk-lib/aws-rds";
import { Bucket } from "aws-cdk-lib/aws-s3";

export class CdkStarterStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    /*** LAMBDA ROLE */
    const role = this.createLambdaRole();

    /*** S3 - LAMBDA FUNCTION */
    const s3Lambda = this.createLambda(
      role,
      LambdaType.S3_LAMBDA,
      S3_LAMBDA_PATH
    );
    /** S3 -Expose LAMBDA URL */
    const s3FnUrl = s3Lambda.addFunctionUrl({
      authType: lambda.FunctionUrlAuthType.NONE,
    });

    /** S3 - OUTPUT LAMBDA URL */
    new CfnOutput(this, S3_LAMBDA_URL, {
      value: s3FnUrl.url,
    });

    /*** RDS - LAMBDA FUNCTION */
    const rdsLambda = this.createLambda(
      role,
      LambdaType.RDS_LAMBDA,
      RDS_LAMBDA_PATH
    );

    /** RDS - Expose LAMBDA URL to publicly accessible */
    const rdsFnUrl = rdsLambda.addFunctionUrl({
      authType: lambda.FunctionUrlAuthType.NONE,
    });

    /** RDS - OUTPUT LAMBDA URL */
    new CfnOutput(this, RDS_LAMBDA_URL, {
      value: rdsFnUrl.url,
    });

    // DISABLE VPC CREATION - AA00B77EFZ
    /**** CREATE VPC */
    // const vpc = this.createVPC();

    /**** CREATE SECURITY GROUP */
    // const securityGroup = this.createSecurityGroup(vpc);

    /** OUTPUT VPC ARN Details*/
    // new CfnOutput(this, "vpcArn", {
    //   value: vpc.vpcArn,
    // });

    /** OUTPUT VPC ID */
    // new CfnOutput(this, "vpcId", {
    //   value: vpc.vpcId,
    // });

    /** OUTPUT VPC ID */
    // new CfnOutput(this, "vpc subnets", {
    //   value: vpc.publicSubnets.join(","),
    // });

    /** OUTPUT Security Group ID */
    // new CfnOutput(this, "securityGroupId", {
    //   value: securityGroup.securityGroupId,
    // });

    /** OUTPUT Security Group VPC ID in the ACCOUNT */
    // new CfnOutput(this, "securityGroupVpcId", {
    //   value: securityGroup.securityGroupVpcId,
    // });
  }

  private createLambda(role: Role, name: string, lambdaPath: string) {
    return new NodejsFunction(this, `${appName}-${name}`, {
      role,
      handler,
      memorySize: 1024,
      timeout: cdk.Duration.seconds(500),
      runtime: lambda.Runtime.NODEJS_16_X,
      entry: path.join(__dirname, lambdaPath),
      functionName: `${appName}-${name}`,
      bundling: {
        minify: false,
        externalModules: [AWS_SDK],
      },
      environment: {
        userName: RDS_DB_USER,
        databaseName: RDS_DB_NAME,
        password: RDS_DB_PASSWORD,
        rdsInstaceId: RDS_INSTANCE_ID,
        region: cdk.Stack.of(this).region,
        rdsInstanceName: RDS_INSTANCE_NAME,
        availabilityZones: JSON.stringify(cdk.Stack.of(this).availabilityZones),
      },
    });
  }

  private createLambdaRole() {
    const role = new Role(this, `${appName}-${LambdaRole.NAME}`, {
      assumedBy: new ServicePrincipal(LambdaRole.SERVICE_PRINCIPAL),
    });

    role.addToPolicy(
      new PolicyStatement({
        resources: [
          `${ARN_LABEL}${Aws.REGION}:${Aws.ACCOUNT_ID}${FUN_LABEL}${appName}-${LambdaType.S3_LAMBDA}`,
          `${ARN_LABEL}${Aws.REGION}:${Aws.ACCOUNT_ID}${FUN_LABEL}${appName}-${LambdaType.RDS_LAMBDA}`,
        ],
        actions: [LambdaRole.ACTIONS],
      })
    );

    role.addManagedPolicy(
      ManagedPolicy.fromAwsManagedPolicyName("AmazonS3FullAccess")
    );
    role.addManagedPolicy(
      ManagedPolicy.fromAwsManagedPolicyName("AmazonRDSFullAccess")
    );
    role.addManagedPolicy(
      ManagedPolicy.fromAwsManagedPolicyName("AmazonRDSDataFullAccess")
    );
    return role;
  }

  private createRDSInstance(id: string) {
    const vpc = new Vpc(this, RDS_VPC_ID, {
      subnetConfiguration: [
        {
          cidrMask: 24,
          name: RDS_SUBNET_NAME,
          subnetType: SubnetType.PUBLIC,
        },
      ],
    });

    const fnSg = new SecurityGroup(this, RDS_SECURITY_GROUP_ID, {
      securityGroupName: RDS_SECURITY_GROUP_NAME,
      vpc: vpc,
      allowAllOutbound: true,
    });

    fnSg.addIngressRule(Peer.anyIpv4(), Port.tcp(3306), RDS_SG_ALLOW_TCP);

    const dbInstance = new DatabaseInstance(this, RDS_INSTANCE_ID, {
      engine: DatabaseInstanceEngine.mysql({
        version: MysqlEngineVersion.VER_8_0_19,
      }),
      vpc,
      instanceIdentifier: RDS_INSTANCE_NAME,
      vpcSubnets: {
        subnetType: SubnetType.PUBLIC,
      },
      instanceType: InstanceType.of(
        InstanceClass.BURSTABLE2,
        InstanceSize.NANO
      ),
      publiclyAccessible: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      databaseName: RDS_DB_NAME,
      securityGroups: [fnSg],
      credentials: Credentials.fromPassword(
        RDS_DB_USER,
        new SecretValue(RDS_DB_PASSWORD)
      ),
    });
    return dbInstance;
  }

  private createVPC() {
    return new Vpc(this, RDS_VPC_ID, {
      subnetConfiguration: [
        {
          cidrMask: 24,
          name: RDS_SUBNET_NAME,
          subnetType: SubnetType.PUBLIC,
        },
      ],
    });
  }

  private createSecurityGroup(vpc: cdk.aws_ec2.Vpc) {
    const fnSg = new SecurityGroup(this, RDS_SECURITY_GROUP_ID, {
      vpc,
      allowAllOutbound: true,
      securityGroupName: RDS_SECURITY_GROUP_NAME,
    });
    fnSg.addIngressRule(Peer.anyIpv4(), Port.tcp(3306), RDS_SG_ALLOW_TCP);
    return fnSg;
  }

  private createS3Bucket() {
    const bucket = new Bucket(this, S3_BUCKET_ID, {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });
    bucket.addToResourcePolicy(
      new PolicyStatement({
        effect: Effect.ALLOW,
        principals: [new AnyPrincipal()],
        actions: [S3_GET_OBJECT, S3_DELETE_OBJECT, S3_PUT_OBJECT],
        resources: [`${bucket.bucketArn}/${S3_PRINCIPAL}`],
      })
    );
    return bucket;
  }
}

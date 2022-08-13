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
} from "aws-cdk-lib/aws-iam";

import {
  LambdaType,
  LambdaRole,
  handler,
  appName,
  AWS_SDK,
  PUBLIC_LAMBDA_URL,
  PUBLIC_LAMBDA_PATH,
  FUN_LABEL,
  ARN_LABEL,
  RDS_DB_NAME,
  RDS_DB_USER,
  RDS_DB_PASSWORD,
  RDS_ENDPOINT,
  RDS_SG_ALLOW_TCP,
  RDS_VPC_ID,
  RDS_INSTANCE_ID,
  RDS_INSTANCE_NAME,
  RDS_SECURITY_GROUP_ID,
  RDS_SECURITY_GROUP_NAME,
  RDS_SUBNET_NAME,
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

export class CdkStarterStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    /**** CREATE VPC */
    const vpc = this.createVPC();

    /**** CREATE SECURITY GROUP */
    const securityGroup = this.createSecurityGroup(vpc);

    /*** RDS INSTANCE (VPC + SUBNET + SECURITY GROUP + MYSQL Instance) */
    // const dbInstance = this.createRDSInstance(id);

    /*** LAMBDA ROLE */
    const role = this.createLambdaRole();

    /*** PUBLIC LAMBDA FUNCTION */
    const publicLambda = this.createPublicLambda(role, securityGroup, vpc);

    /** Expose PUBLIC LAMBDA URL */
    const fnUrl = publicLambda.addFunctionUrl({
      authType: lambda.FunctionUrlAuthType.NONE,
    });

    /** OUTPUT VPC ARN */
    new CfnOutput(this, "vpcArn", {
      value: vpc.vpcArn,
    });

    /** OUTPUT VPC ID */
    new CfnOutput(this, "vpcId", {
      value: vpc.vpcId,
    });

    /** OUTPUT Security Group ID */
    new CfnOutput(this, "securityGroupId", {
      value: securityGroup.securityGroupId,
    });

    /** OUTPUT Security Group VPC ID */
    new CfnOutput(this, "securityGroupVpcId", {
      value: securityGroup.securityGroupVpcId,
    });

    /** OUTPUT PUBLIC LAMBDA URL */
    new CfnOutput(this, PUBLIC_LAMBDA_URL, {
      value: fnUrl.url,
    });
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

  private createPublicLambda(role: Role, fnSg: SecurityGroup, vpc: Vpc) {
    return new NodejsFunction(this, `${appName}-${LambdaType.PUBLIC_LAMBDA}`, {
      role,
      handler,
      memorySize: 1024,
      timeout: cdk.Duration.seconds(500),
      runtime: lambda.Runtime.NODEJS_16_X,
      entry: path.join(__dirname, PUBLIC_LAMBDA_PATH),
      functionName: `${appName}-${LambdaType.PUBLIC_LAMBDA}`,
      bundling: {
        minify: false,
        externalModules: [AWS_SDK],
      },
      environment: {
        vpcId: vpc.vpcId,
        vpcArn: vpc.vpcArn,
        userName: RDS_DB_USER,
        databaseName: RDS_DB_NAME,
        password: RDS_DB_PASSWORD,
        rdsInstaceId: RDS_INSTANCE_ID,
        region: cdk.Stack.of(this).region,
        rdsInstanceName: RDS_INSTANCE_NAME,
        securityGroupId: fnSg.securityGroupId,
        securityGroupVpcId: fnSg.securityGroupVpcId,
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
          `${ARN_LABEL}${Aws.REGION}:${Aws.ACCOUNT_ID}${FUN_LABEL}${appName}-${LambdaType.PUBLIC_LAMBDA}`,
          `${ARN_LABEL}${Aws.REGION}:${Aws.ACCOUNT_ID}${FUN_LABEL}${appName}-${LambdaType.PRIVATE_LAMBDA}`,
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

  // private createS3Bucket() {
  //   const bucket = new Bucket(this, S3_BUCKET_ID, {
  //     removalPolicy: cdk.RemovalPolicy.DESTROY,
  //     autoDeleteObjects: true,
  //   });
  //   bucket.addToResourcePolicy(
  //     new PolicyStatement({
  //       effect: Effect.ALLOW,
  //       principals: [new AnyPrincipal()],
  //       actions: [S3_GET_OBJECT, S3_DELETE_OBJECT, S3_PUT_OBJECT],
  //       resources: [`${bucket.bucketArn}/${S3_PRINCIPAL}`],
  //     })
  //   );
  //   return bucket;
  // }
}

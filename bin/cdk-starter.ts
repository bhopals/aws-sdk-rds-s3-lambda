#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import { CdkStarterStack } from "../lib/cdk-starter-stack";
import { appName, region } from "../lib/stackConfiguration";

new CdkStarterStack(new cdk.App(), appName, {
  stackName: appName,
  env: {
    region: process.env.CDK_DEFAULT_REGION || process.env.REGION || region,
    account: process.env.CDK_DEFAULT_ACCOUNT || process.env.ACCOUNT,
  },
});

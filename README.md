## TypeScript Lambda functions in AWS CDK

### How to Use

1. Clone the repository

2. Install the dependencies

```bash
npm install
```

3. ONE TIME ONLY - if it is the First time, then bootstrap the repository config (Only run this the very first time, SKIP after that)

```bash
npx aws-cdk bootstrap
```

5. CDk Synth

```bash
cdk synth
```

6. Create the CDK stack

```bash
cdk deploy
```

7. Open the AWS Console and the stack should be created in your default region

8. Cleanup

```bash
cdk destroy
```

- Make sure to go to S3, and delete the bucket with name something that looks like(`cdk-*-us-west-2`)

- Make sure to go to CloudFormation, and delete any Stack related (especially - `CDKToolkit`)

##### References

### S3

- S3 (https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-s3/index.html)

- S3 LIST Bucket (https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-s3/classes/listbucketscommand.html)

- S3 Create Bucket (https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-s3/classes/createbucketcommand.html)

### RDS

- RDS (https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-rds/index.html)

- RDS List Instances (https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-rds/classes/rds.html#describedbinstances)

- RDS Create Instance(https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-rds/classes/createdbinstancecommand.html)
- RDS Create Instance PARAMS (https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-rds/interfaces/createdbinstancecommandinput.html)

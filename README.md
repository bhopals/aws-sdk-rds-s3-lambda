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

9. Also, navigate to RDS and S3 console to delete the RESOURCES created using SDK. You
   need to manually delete those once you are done with the TESTING otherwise it will incur you the cost.

### Lambda Stack Details

Once STACK is deployed, you should see TWO Lambda. Both Lambda has Public URL so
open the Lambda URL to trigger Create/Query request.

- aws-sdk-s3-lambda (To Create and Query S3 )
- aws-sdk-rds-lambda (To Create and Query RDS (MySql) Instances)

### Additional Steps once RDS instance is Created

Note: This needs to be done once the STACK is DEPLOYED (If a RULE for TCP inbound is missing).

One MySql Instance is up and Running, make sure you ADD an INBOUND Rule to make DATABASE
publicly accessible.

- STEPS to Create a rule`
  - Go RDS console
  - Under "Connectivity & Security Section", look for VPC security groups, You will find a hyperlink
    for example - (sg-\*\*\*).
  - Clicking on the link, will redirect you to Security Rules.
  - Click on Inbound Rule ==> Edit Inbound Rules
  - Add rules with a Below Settings.
    - Type - MySQL/Aurora
    - Protocol - TCP
    - Port Range - 3306
    - Source - custom
      0.0.0.0
  - SAVE the RULE

### Testing

- You can use Lambda TEST function to test the functionality of the Lambdas

### References

#### S3

- S3 (https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-s3/index.html)

- S3 LIST Bucket (https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-s3/classes/listbucketscommand.html)

- S3 Create Bucket (https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-s3/classes/createbucketcommand.html)

#### RDS

- RDS (https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-rds/index.html)

- RDS List Instances (https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-rds/classes/rds.html#describedbinstances)

- RDS Create Instance(https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-rds/classes/createdbinstancecommand.html)
- RDS Create Instance PARAMS (https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-rds/interfaces/createdbinstancecommandinput.html)

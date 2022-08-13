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

- MYSQL Documentation
  - https://www.npmjs.com/package/mysql2
  - https://github.com/sidorares/node-mysql2/tree/master/documentation

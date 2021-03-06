import * as cdk from "@aws-cdk/core";
import * as s3 from "@aws-cdk/aws-s3";

export class ITest1App extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props = {}) {
    super(scope, id, props);
    const bucket = new s3.Bucket(this, "Bucket");
    new cdk.CfnOutput(this, "BucketName", { value: bucket.bucketName });
  }
}

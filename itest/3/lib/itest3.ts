import * as cdk from "@aws-cdk/core";
import * as s3 from "@aws-cdk/aws-s3";
import { Names, RemovalPolicy } from "@aws-cdk/core";

export class ITest2App extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props = {}) {
    super(scope, id, props);
    const bucket = new s3.Bucket(this, `Bucket${id}`, {
      removalPolicy: RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });
    new cdk.CfnOutput(this, "BucketName", { value: bucket.bucketName });
    new cdk.CfnOutput(this, "BucketPath", { value: bucket.node.path });
    new cdk.CfnOutput(this, "BucketUniqueId", {
      value: Names.uniqueId(bucket),
    });
    new cdk.CfnOutput(this, "BucketAddress", { value: bucket.node.addr });
  }
}

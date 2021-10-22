import * as cdk from "@aws-cdk/core";
import * as s3 from "@aws-cdk/aws-s3";
import { RemovalPolicy } from "@aws-cdk/core";

export class MortalBucket extends s3.Bucket {
  constructor(scope: cdk.Construct, id: string, props: s3.BucketProps = {}) {
    super(scope, id, {
      removalPolicy: RemovalPolicy.DESTROY,
      // autoDeleteObjects: true,
      ...props,
    });
  }
}

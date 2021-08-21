const childProcess = require("child_process");
import * as cdk from "@aws-cdk/core";
import * as s3 from "@aws-cdk/aws-s3";
import { RemovalPolicy } from "@aws-cdk/core";
import "@aws-cdk/assert/jest";
import { ResourcePart } from "@aws-cdk/assert/lib/assertions/have-resource";
import { MortalBucket } from "..";

describe("removables", () => {
  test("tests should run", () => {
    expect(false).toBe(false);
  });
  test("create a stack that doesn't even use my construct", (done) => {
    const stdout = childProcess.execSync(
      "GITHUB_REPOSITORY=cdk-turnkey/removables GITHUB_REF=refs/heads/main " +
        "npx cdk synth " +
        "--app itest/1/bin/itest1.js " +
        "--json " +
        "| jq '.'"
    );
    try {
      const j = JSON.parse(stdout.toString());
      // console.log(j["Resources"]["Bucket83908E77"]);
      // assert on the template

      done();
    } catch (error) {
      done(error);
    }
  });
  test("don't use my construct, but set removal and auto-delete policies", (done) => {
    const stdout = childProcess.execSync(
      "GITHUB_REPOSITORY=cdk-turnkey/removables GITHUB_REF=refs/heads/main " +
        "npx cdk synth " +
        "--app itest/2/bin/itest2.js " +
        "--json " +
        "| jq '.'"
    );
    try {
      const j = JSON.parse(stdout.toString());
      // console.log(j["Resources"]);
      done();
    } catch (error) {
      done(error);
    }
  });
  test("assert on a stack", () => {
    class MyStack extends cdk.Stack {
      constructor(scope: cdk.App, id: string, props = {}) {
        super(scope, id, props);
        const bucket = new s3.Bucket(this, `Bucket${id}`, {
          removalPolicy: RemovalPolicy.RETAIN,
          // autoDeleteObjects: true,
        });
      }
    }
    const app = new cdk.App();
    const myStackInstance = new MyStack(app, "MyStackInstance");
    expect(myStackInstance).toHaveResource("AWS::S3::Bucket");
    expect(myStackInstance).toCountResources("AWS::ApiGateway::Method", 0);
    // const assembly = app.synth();
    // console.log(assembly.stacks.length);
    // console.log(assembly.stacks[0].template);
    expect(myStackInstance).toHaveResourceLike(
      "AWS::S3::Bucket",
      {
        Type: "AWS::S3::Bucket",
        UpdateReplacePolicy: "Retain",
        DeletionPolicy: "Retain",
      },
      ResourcePart.CompleteDefinition
    );
  });
  test(
    "a MortalBucket should have UpdateReplace and Deletion Policies of " +
      "DESTROY",
    () => {
      class MyStack extends cdk.Stack {
        constructor(scope: cdk.App, id: string, props = {}) {
          super(scope, id, props);
          const mortalBucket = new MortalBucket(this, "MortalBucket");
        }
      }
      const app = new cdk.App();
      const myStack = new MyStack(app, "MyStack");
      expect(myStack).toHaveResource("AWS::S3::Bucket");
      expect(myStack).toHaveResourceLike(
        "AWS::S3::Bucket",
        {
          Type: "AWS::S3::Bucket",
          UpdateReplacePolicy: "Delete",
          DeletionPolicy: "Delete",
        },
        ResourcePart.CompleteDefinition
      );
    }
  );
  test("synth my construct", (done) => {
    const stdout = childProcess.execSync(
      "GITHUB_REPOSITORY=cdk-turnkey/removables GITHUB_REF=refs/heads/main " +
        "npx cdk synth " +
        "--app itest/3/bin/itest3.js " +
        "--json " +
        "| jq '.'"
    );
    try {
      const j = JSON.parse(stdout.toString());
      // console.log(j["Resources"]);
      done();
    } catch (error) {
      done(error);
    }
  });
});

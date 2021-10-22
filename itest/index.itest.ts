const childProcess = require("child_process");
import * as cdk from "@aws-cdk/core";
import * as s3 from "@aws-cdk/aws-s3";
import { RemovalPolicy } from "@aws-cdk/core";
import "@aws-cdk/assert/jest";
import { ResourcePart } from "@aws-cdk/assert/lib/assertions/have-resource";
import { MortalBucket } from "..";
const AWS = require("aws-sdk");

// 1: a test with a mortal bucket: deploy, deploy contents, delete stack, assert
// that the bucket is gone

// 2: a test with a normal bucket: deploy, deploy contents, delete stack, assert
// that the bucket is not gone

// 3: what happens if you deploy/deploy contents/delete a normal bucket with
// removal policy set to destroy? will it fail because the contents are still
// there?

const s3sdk = new AWS.S3();
describe("removables", () => {
  test("create a stack that doesn't even use my construct", async () => {
    const outDeploy = childProcess.execSync(
      "GITHUB_REPOSITORY=cdk-turnkey/mortals GITHUB_REF=refs/heads/main " +
        "npx cdk deploy " +
        "--app itest/1/bin/itest1.js"
    );

    // put something in the bucket
    // YQo=

    const j = JSON.parse(outDeploy.toString());

    // read stack outputs to get the bucket name
    let Bucket;

    const putObjectParams = {
      ACL: "authenticated-read",
      Body: "YQo=",
      Bucket,
      Key: "exampleobject",
    };
    const putObjectResponse = await new Promise((resolve, reject) => {
      s3sdk.putObject(putObjectParams, function (err: any, data: any) {
        resolve({ err, data });
      });
    });
    console.log("putObjectResponse:");
    console.log(putObjectResponse);
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

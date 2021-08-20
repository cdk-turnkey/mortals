const childProcess = require("child_process");

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
      console.log(j.Resources);
      done();
    } catch (error) {
      done(error);
    }
  });
});

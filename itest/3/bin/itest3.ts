#!/usr/bin/env node
import * as cdk from "@aws-cdk/core";
import { ITest2App } from "../lib/itest3";
const stackname = require("@cdk-turnkey/stackname");

const app = new cdk.App();
new ITest2App(app, stackname("a"));

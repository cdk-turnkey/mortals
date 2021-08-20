#!/usr/bin/env node
import * as cdk from "@aws-cdk/core";
import { ITest1App } from "../lib/itest1";
const stackname = require("@cdk-turnkey/stackname");

const app = new cdk.App();
new ITest1App(app, stackname());

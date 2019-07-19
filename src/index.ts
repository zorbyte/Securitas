import { config } from "dotenv";
config();

import BluePromise = require("bluebird");

import { Client } from "./lib";

BluePromise.config({
  longStackTraces: false,
});

const client = new Client({
  disableEveryone: true,
  disabledEvents: ["TYPING_START"],
});

try {
  client.login();
} catch (err) {
  client.log.error(`Failed to bootstrap and log into Discord.`, err);
}


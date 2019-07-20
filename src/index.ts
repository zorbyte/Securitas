import { config } from "dotenv";
import BluePromise = require("bluebird");
import { Client } from "./lib";

config();

BluePromise.config({
  longStackTraces: false,
});

const client = new Client({
  disableEveryone: true,
  disabledEvents: ["TYPING_START"],
});

try {
  client.login();
} catch (error) {
  client.log.error(`Failed to bootstrap and log into Discord.`, error);
}


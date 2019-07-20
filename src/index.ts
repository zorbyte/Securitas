/* eslint-disable unicorn/no-process-exit */

import { config } from "dotenv";
import { Client } from "./lib";

config();

const client = new Client({
  disableEveryone: true,
  disabledEvents: ["TYPING_START"],
});

try {
  client.login().catch(error => {
    client.log.error(`Failed to bootstrap and log into Discord.`, error);
    process.exit(1);
  });
} catch (error) {
  client.log.error(`An unknown error occurred.`, error);
  process.exit(1);
}

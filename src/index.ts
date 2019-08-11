/* eslint-disable unicorn/no-process-exit */

import { config } from "dotenv";
import { Client } from "./lib";

config();

const client = new Client({
  disableEveryone: true,
  disabledEvents: ["TYPING_START"],
});

client.login().catch(error => {
  client.log.error(`Failed to bootstrap and log into Discord.`, error);
  process.exit(1);
});

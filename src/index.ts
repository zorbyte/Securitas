import { config } from "dotenv";
config();

import { Client } from "./lib";

const client = new Client({
  disableEveryone: true,
  disabledEvents: ["TYPING_START"],
});

client
  .login();


import { config } from "dotenv";
config();

import DeXClient from "./lib/structures/Client";
import { commandDispatcher, didYouMean } from "./middleware/message";

const client = new DeXClient({
  disableEveryone: true,
  disabledEvents: ["TYPING_START"],
});

client
  .use(commandDispatcher)
  .use(didYouMean)
  .login();

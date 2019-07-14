import { config } from "dotenv";
config();

import { Client } from "./lib";
import { commandDispatcher, didYouMean, antiSpam, TMessageMid } from "./middleware/message";

const client = new Client({
  disableEveryone: true,
  disabledEvents: ["TYPING_START"],
});

const skipSelf: TMessageMid = (msg, { client }, next) =>
  msg.author.id !== client.user.id ? next() : void 0;

client
  .use(skipSelf)
  .use(antiSpam)
  .use(commandDispatcher)
  .use(didYouMean)
  .login();

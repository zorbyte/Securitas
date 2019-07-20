import { User, Message } from "discord.js";

import config = require("../../../configs/config.json");
import { Listener } from "../../loaders/loadEvents";
import { createLogger } from "../../lib";
import CommandContext from "./Context";

// Middleware.
import antiSpam, { SpamInfo } from "./antiSpam";
import commandDispatcher from "./commandDispatcher";
import didYouMean from "./didYouMean";
import getGuildDoc from "./getGuildDoc";

export interface CmdMessage extends Message {
  author: User;
}

const log = createLogger("events:message");
const readyListener: Listener = client => {
  client
    .use(getGuildDoc)
    .use(antiSpam)
    .use(commandDispatcher)
    .use(didYouMean);

  return client.on("message", (msg: CmdMessage) => {
    setImmediate(async () => {
      try {
        const ctx = new CommandContext(client, msg, config, log.child(msg.id));

        await client.messageStack.handler(ctx);
      } catch (error) {
        log.error(error);
      }
    });
  });
};

export { CommandContext, SpamInfo };
export default readyListener;

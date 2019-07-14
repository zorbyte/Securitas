import { User, Message } from "discord.js";

import { TListener } from "../../loaders/loadEvents";
import { createLogger } from "../../lib";
import CommandContext from "./Context";
import config = require("../../../configs/config.json");

export interface IMessage extends Message {
  author: User;
}

const log = createLogger("events:message");
const readyListener: TListener = client => client.on("message", (msg: IMessage) => {
    setImmediate(async () => {
      try {
        const ctx = new CommandContext(client, msg, config, log.child(msg.id));

        await client.messageStack.handler(ctx);
      } catch (err) {
        log.error(err);
      }
    });
});

export { CommandContext };
export default readyListener;

import createDebug from "debug";
import { User } from "discord.js";

import { TListener } from "../loaders/loadListeners";
import { Stopwatch, Util } from "../lib";

const debug = createDebug("DeX:events:message");

const readyListener: TListener = client => client.on("message", msg => {
    setImmediate(async () => {
      try {
        const timer = new Stopwatch();

        await client.messageStack.handler({
          data: msg,
          ctx: { client, timer, debug, author: msg.author as User },
        });
      } catch (err) {
        Util.logError(err);
      }
    });
});

export default readyListener;

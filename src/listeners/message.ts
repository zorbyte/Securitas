import createDebug from "debug";
import { User } from "discord.js";

import { TListener } from "../loaders/loadListeners";
import { Stopwatch, Util } from "../lib";

const debug = createDebug("DeX:listener:message");

const readyListener: TListener = client => client.on("message", msg => {
    setImmediate(async () => {
      try {
        const timer = new Stopwatch();

        // Make a humanised incomming message log.
        const incommingData = Util.formatObj({
          ID: msg.id,
          authorID: (msg.author as User).id,
          channelID: msg.channel.id,
          channelType: msg.channel.type,
          content: Util.truncateStr(msg.content),
        });
        debug(`Incomming message.${incommingData}`);

        await client.messageStack.handler({
          data: msg,
          ctx: { client, timer, debug },
        });
      } catch (err) {
        Util.logError(err);
      }
    });
});

export default readyListener;

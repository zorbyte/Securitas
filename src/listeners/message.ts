import { TListener } from "../loaders/loadListeners";
import { IMessage } from "../middleware/message";
import { Stopwatch, createLogger } from "../lib";
import config = require("../../configs/config.json");

const log = createLogger("events:message");

const readyListener: TListener = client => client.on("message", (msg: IMessage) => {
    setImmediate(async () => {
      try {
        const timer = new Stopwatch();

        await client.messageStack.handler({
          data: msg,
          ctx: { client, timer, config, log: log.child(msg.id) },
        });
      } catch (err) {
        log.error(err);
      }
    });
});

export default readyListener;

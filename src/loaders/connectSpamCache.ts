import { MicroframeworkSettings } from "microframework-w3tec";
import Keyv = require("keyv");

import config = require("../../configs/config.json");
import { createLogger, Stopwatch } from "../lib";
import { ISpamInfo } from "../events/message"

const log = createLogger("loader:spamCache");
async function connectSpamCache(settings: MicroframeworkSettings): Promise<void> {
  log("Connecting to redis...");
  const timer = new Stopwatch();
  const redisCache = new Keyv<ISpamInfo>(config.redisUri, {
    namespace: "Securitas:spamCache",
    adapter: "redis",
  });

  log(`Connected in ${timer.stop(2)}ms.`);

  settings.onShutdown(() => redisCache.clear());

  redisCache.on("error", err => log.error("An error occurred while connecting to redis!", err));

  settings.setData("spamCache", redisCache);
};

export default connectSpamCache;

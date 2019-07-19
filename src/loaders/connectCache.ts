import { MicroframeworkSettings } from "microframework-w3tec";
import Keyv = require("keyv");

import config = require("../../configs/config.json");
import { createLogger, Stopwatch } from "../lib";
import { ISpamInfo } from "../events/message";

const log = createLogger("loader:cache");
function connectSpamCache(settings: MicroframeworkSettings): Promise<void> {
  return new Promise((ok, fail) => {
    log("Connecting to redis...");
    const timer = new Stopwatch();
    let redisCache: Keyv<ISpamInfo> | null = new Keyv<ISpamInfo>(config.redisUri, {
      namespace: "Securitas:cache",
      adapter: "redis",
    });

    log(`Connected in ${timer.stop(2)}ms.`);

    settings.onShutdown(() => {
      if (redisCache) redisCache.clear();
    });

    redisCache.once("error", err => {
      log.error("An error occurred while connecting to redis!", err);
      redisCache = null;
      fail();
    });

    settings.setData("cache", redisCache);
    
    ok();
  });
};

export default connectSpamCache;

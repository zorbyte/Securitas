import { MicroframeworkSettings } from "microframework-w3tec";
import Keyv = require("keyv");
import { Stopwatch } from "../lib";
import { SpamInfo } from "../events/message";
import { loaderLog } from "./";
import config = require("../../configs/config.json");

console.log(loaderLog)

const log = loaderLog.child("cache");
function connectSpamCache(settings: MicroframeworkSettings): Promise<void> {
  return new Promise((resolve, reject) => {
    log("Connecting to redis...");
    const timer = new Stopwatch();
    let redisCache: Keyv<SpamInfo> | null = new Keyv<SpamInfo>(config.redisUri, {
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
      reject();
    });

    settings.setData("cache", redisCache);

    resolve();
  });
}

export default connectSpamCache;

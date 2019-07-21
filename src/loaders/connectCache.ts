import { MicroframeworkSettings } from "microframework-w3tec";
import Keyv = require("keyv");
import { Stopwatch, createLogger } from "../lib";
import { SpamInfo } from "../events/message";
import config = require("../../configs/config.json");

const log = createLogger("cache");
function connectCache(settings: MicroframeworkSettings): void {
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

  const errorListener = (err: any) => {
    log.error("An error occurred while connecting to redis!", err);
    redisCache = null;
    process.exit(1);
  };

  redisCache.on("error", errorListener);

  settings.setData("cache", redisCache);
  settings.setData("cacheLog", log);
  redisCache.removeListener("error", errorListener)
}

export default connectCache;

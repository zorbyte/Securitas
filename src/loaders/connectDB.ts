import { r } from "rethinkdb-ts";
import { MicroframeworkSettings } from "microframework-w3tec";
import { createLogger, Stopwatch } from "../lib";
import config = require("../../configs/config.json");

const log = createLogger("loader:database");
function connectDB(settings: MicroframeworkSettings): Promise<void> {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise<void>(async (resolve, reject) => {
    try {
      log("Connecting to RethinkDB...");
      const timer = new Stopwatch();
      const pool = await r.connectPool({
        // @ts-ignore
        host: config.host,
        port: config.port,
        db: config.db,
        database: config.db,
        silent: true,
        log(msg: string) {
          log.error(msg);
        },
      });

      const dbList = await r.dbList().run();
      if (!dbList.includes("securitas")) await r.dbCreate("securitas").run();

      settings.onShutdown(() => pool.drain());

      log(`Successfully connected to RethinkDB in ${timer.stop(2)}ms.`);

      resolve();
    } catch (error) {
      reject(error);
    }
  })
    .catch((err: any | any[]) => {
      const msg = "An error occurred while connecting to RethinkDB.";
      if (Array.isArray(err))
        log.error(`${msg}`, ...err);
      else
        log.error(msg, err);

      // eslint-disable-next-line unicorn/no-process-exit
      process.exit(1);
    });
}

export default connectDB;

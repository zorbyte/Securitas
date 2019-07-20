import { types } from "util";
import { RethinkAdapter } from "pims-rethinkdb";
// eslint-disable-next-line import/no-extraneous-dependencies
import { ReqlClient } from "rethinkdbdash";
import { MicroframeworkSettings } from "microframework-w3tec";
import unescapeJS = require("unescape-js");
import { createLogger, Stopwatch } from "../lib";
import models from "../models";

const log = createLogger("loader:database");
function connectDB(settings: MicroframeworkSettings): Promise<void> {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise<void>(async (resolve, reject) => {
    try {
      let isDone = false;
      log("Connecting to RethinkDB...");
      const timer = new Stopwatch();
      const adapter = new RethinkAdapter({
        // @ts-ignore
        host: "localhost",
        port: 28015,
        db: "securitas",
        database: "securitas",
        silent: true,
        log(msg: string) {
          const possibleErr = msg.split("Error:");
          let err: Error | null = null;
          if (possibleErr[1] && possibleErr[1].startsWith("{")) {
            possibleErr[1] = unescapeJS(possibleErr[1]);
            possibleErr[1] = possibleErr[1].slice(possibleErr[1].indexOf("\"message\":") + "\"message\":".length + 1, -1);
            possibleErr[1] = possibleErr[1].slice(0, possibleErr[1].indexOf("\n"));
            const limitBefore = Error.stackTraceLimit;
            Error.stackTraceLimit = 4;
            err = new Error(`${possibleErr[1]}.`);
            Error.stackTraceLimit = limitBefore;
            msg = possibleErr[0];
          }
          msg = unescapeJS(msg).replace(/\n/, "").trim();
          msg = (msg.endsWith(".") || msg.endsWith(".")) ? msg : `${msg}.`;

          // @ts-ignore
          if (types.isNativeError(msg) || msg instanceof Error) {
            if (!isDone) return reject(msg);
            log.error(msg);
          }
          if (err) {
            // eslint-disable-next-line prefer-promise-reject-errors
            if (!isDone) return reject([msg, err]);
            log.error(msg, err);
          }
          log(msg);
        },
        models,
      });

      const r = adapter.r as ReqlClient;
      const dbList = await r.dbList().run();
      if (!dbList.includes("securitas")) await r.dbCreate("securitas").run();

      await adapter.ensure();
      settings.onShutdown(() => adapter.close());

      log(`Successfully connected to RethinkDB in ${timer.stop(2)}ms.`);

      settings.setData("adapter", adapter);
      isDone = true;
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

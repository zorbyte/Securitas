// @ts-nocheck
import { r } from "rethinkdb-ts";
import config = require("../../../configs/config.json");
import { isError } from "util";
import unescapeJS = require("unescape-js");
import { createLogger } from "./";

class Driver {
  public log = createLogger("driver");
  private getQueries = new Map<string, string>();
  constructor() { }
  
  public connect() {
    return new Promise<void>(async (ok, fail) => {
      let isDone = false;
      let that = this;
      await r.connect({
        db: config.dbName,
        host: "localhost",
        silent: true,
        log(msg) {
          let possibleErr = msg.split("Error:");
          let err: Error | null = null;
          if (possibleErr[1] && possibleErr[1].startsWith("{")) {
            possibleErr[1] = unescapeJS(possibleErr[1]);
            possibleErr[1] = possibleErr[1].slice(possibleErr[1].indexOf("\"message\":") + "\"message\":".length + 1, -1);
            possibleErr[1] = possibleErr[1].slice(0, possibleErr[1].indexOf("\n"));
            let limitBefore = Error.stackTraceLimit;
            Error.stackTraceLimit = 4;
            err = new Error(`${possibleErr[1]}.`);
            Error.stackTraceLimit = limitBefore;
            msg = possibleErr[0];
          }
          msg = unescapeJS(msg).replace(/\n/, "").trim();
          msg = !(msg.endsWith(".") || msg.endsWith(".")) ? `${msg}.` : msg;
          if (isError(msg)) {
            if (!isDone) return fail(msg);
            that.log.error(msg);
          }
          if (err) {
            if (!isDone) return fail([msg, err]);
            that.log.error(msg, err);
          }
          that.log(msg);
        },
      });

      ok();
    });
  }

  public get(id: string) {
    let query = this.getQueries.get(`get_${id}`)
    if (!query) {
      this.set(`get_${id}`)
    }
  }

  public getOne() { }
}

export default Driver;

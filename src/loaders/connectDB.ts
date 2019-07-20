import { r } from "rethinkdb-ts";
import { MicroframeworkSettings } from "microframework-w3tec";
import { Stopwatch, seedDatabase } from "../lib";
import { loaderLog } from ".";
import config = require("../../configs/config.json");

const log = loaderLog.child("database");
async function connectDB(settings: MicroframeworkSettings): Promise<void> {
  try {
    log("Connecting to RethinkDB...");
    const timer = new Stopwatch();
    const pool = await r.connectPool({
      host: config.host,
      port: config.port,
      db: config.db,
      database: config.db,
      silent: true,
      log(msg: string) {
        log.error(msg);
      },
    });

    log("Seeding database.");
    await seedDatabase();

    settings.onShutdown(() => pool.drain());

    log(`Successfully connected to RethinkDB in ${timer.stop(2)}ms.`);
  } catch (error) {
    log.error("An error occurred while connecting to RethinkDB.");
    throw error;
  }
}

export default connectDB;

//import { MicroframeworkSettings } from "microframework-w3tec";
import { FuseDB, MongoAdapter } from "fusedb";

import { createLogger } from "../lib";

const log = createLogger("loader:database");
function loadDB(): void {
  log("Configuring MongoDB Driver...");
  FuseDB.setup({
    adapter: MongoAdapter({
        url : "mongodb://localhost:27017/securitas",
        dbName : "securitas",
    }),
  });
};

export default loadDB;

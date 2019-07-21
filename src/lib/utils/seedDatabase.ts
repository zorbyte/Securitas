import { r } from "rethinkdb-ts";
import { Driver } from ".";
import config = require("../../../configs/config.json");

async function seedDatabase(): Promise<void> {
  // Setup the db.
  const dbList = await r.dbList().run();
  if (!dbList.includes(config.db)) await r.dbCreate(config.db).run();

  const tableList = await r.tableList().run();
  if (!tableList.includes("users")) await r.tableCreate("users").run();
  if (!tableList.includes("guilds")) await r.tableCreate("guilds").run();

  // Add the maintainer if not present.
  await Driver.fetchUser(config.ownerID, {
    id: config.ownerID,
    isMaintainer: true,
  });
}

export default seedDatabase;

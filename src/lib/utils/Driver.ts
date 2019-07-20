import { r, RTable } from "rethinkdb-ts";
import { User, Guild } from "../../models";
import { Permissions } from "..";

class Driver {
  public static get userTable(): RTable<User> {
    return r.table<User>("users");
  }

  public static get guildTable(): RTable<Guild> {
    return r.table<Guild>("guild");
  }

  public static async fetchGuild(id: string): Promise<Guild | undefined>;
  public static async fetchGuild(id: string, createData?: Guild): Promise<Guild>;
  public static async fetchGuild(id: string, createData?: Guild): Promise<Guild | undefined> {
    let guild: Guild = await Driver.guildTable.get(id).run();
    if (!guild && createData) {
      await Driver.guildTable.insert(createData).run();
      guild = createData;
    }
    return guild;
  }

  public static async fetchUser(id: string): Promise<User | undefined>;
  public static async fetchUser(id: string, createData?: User): Promise<User>;
  public static async fetchUser(id: string, createData?: User): Promise<User | undefined> {
    let user = await Driver.userTable.get(id).run();
    if (!user && createData) {
      await Driver.userTable.insert(createData).run();
      user = createData;
    }
    return user;
  }

  public static async addUserGuild(userId: string, guildId: string, permission: Permissions): Promise<User> {
    let user = await Driver.fetchUser(userId, {
      id: userId,
    });
    if (!user.guilds) user.guilds = [];
    user.guilds.push({
      id: guildId,
      perm: user.isMaintainer ? 4 : Math.min(permission, 3),
    });
    const { changes } = await Driver.userTable.insert(user, {
      conflict: "update",
      returnChanges: true,
    }).run();
    if (changes && changes[0].new_val) user = changes[0].new_val;
    return user;
  }
}

export default Driver;

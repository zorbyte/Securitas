import { r } from "rethinkdb-ts";
import { CommandMid } from "../../lib";
import { Guild } from "../../models";

const getGuildDoc: CommandMid = async (ctx, next) => {
  const { msg, config } = ctx;
  ctx.prefix = config.prefix;
  if (!msg.guild) return next();
  let guild = await r.table<Guild>("guilds").get(msg.guild.id).run();

  if (guild)
    ctx.prefix = guild.prefix;
  else {
    guild = {
      prefix: config.prefix,
      antiSpam: false,
      id: msg.guild.id,
    };

    await r.table<Guild>("guilds").insert(guild).run();
  }
  ctx.guild = guild;
  next();
};

export default getGuildDoc;

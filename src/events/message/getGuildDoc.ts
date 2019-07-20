import { TCommandMid } from "../../lib";
import { Guild } from "../../models";

const getGuildDoc: TCommandMid = async (ctx, next) => {
  const { msg, client, config } = ctx;
  ctx.prefix = config.prefix;
  if (!msg.guild) return next();
  let guild = await client
    .adapter
    .getOne(Guild, msg.guild.id);
  if (guild)
    ctx.prefix = guild.prefix;
  else {
    guild = new Guild();
    guild.prefix = config.prefix;
    guild.antiSpam = false;
    guild.id = msg.guild.id;
    await client.adapter.save(guild);
  }
  ctx.guild = guild;
  next();
};

export default getGuildDoc;

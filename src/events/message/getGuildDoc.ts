import { CommandMid, Driver } from "../../lib";

const getGuildDoc: CommandMid = async (ctx, next) => {
  const { msg, config } = ctx;
  if (!msg.guild) return next();
  const guild = await Driver.fetchGuild(msg.guild.id, {
    prefix: config.prefix,
    antiSpam: false,
    id: msg.guild.id,
  });

  ctx.prefix = guild.prefix || config.prefix;

  ctx.guild = guild;
  next();
};

export default getGuildDoc;

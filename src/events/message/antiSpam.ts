import { TCommandMid } from "../../lib";

export interface ISpamInfo {
  msgTime: number;
  fastMsgAmnt: number;
  content: string;
  channelID: string;
}

const antiSpam: TCommandMid = async ({ msg, guild, client: { user, redisCache }, config }, next) => {
  if (msg.author.id === user.id || (guild && !guild.antiSpam)) return next();
  const accessor = `spam:${msg.author.id}`;
  let lastMsg = await redisCache.get(accessor);
  if (!lastMsg)
    lastMsg = {
      msgTime: 0,
      fastMsgAmnt: 0,
      content: `NOT_SPAM_${msg.content}`,
      channelID: "NOT_SPAM",
    };

  const threshold = config.spamThreshold;
  const isSpamMsg = (msg.createdTimestamp - lastMsg.msgTime <= 2000) && lastMsg.channelID === msg.channel.id;
  let fastMsgAmnt = isSpamMsg ? lastMsg.fastMsgAmnt + 1 : 0;
  const isSpam = fastMsgAmnt >= threshold;
  if (isSpam) fastMsgAmnt = 0;
  redisCache.set(accessor, {
    msgTime: msg.createdTimestamp,
    fastMsgAmnt,
    content: msg.content,
    channelID: msg.channel.id,
  }, 2000);

  if (isSpam) return msg.channel.send("Spam!");
  next();
};

export default antiSpam;

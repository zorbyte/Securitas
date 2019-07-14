import { TCommandMid } from "../../lib";

export interface ISpamInfo {
  msgTime: number;
  fastMsgAmnt: number;
  content: string;
  channelID: string;
}

const antiSpam: TCommandMid = async (ctx, next) => {
  const { msg, client, config } = ctx;
  const { spamCache } = client;
  if (msg.author.id === client.user.id) return next();
  let lastMsg = await spamCache.get(msg.author.id);
  if (!lastMsg) {
    lastMsg = {
      msgTime: 0,
      fastMsgAmnt: 0,
      content: `NOT_SPAM_${msg.content}`,
      channelID: "NOT_SPAM",
    }
  }

  const threshold = config.spamThreshold;
  let isSpamMsg = (msg.createdTimestamp - lastMsg.msgTime <= 2000) && lastMsg.channelID === msg.channel.id;
  let fastMsgAmnt = isSpamMsg ? lastMsg.fastMsgAmnt + 1 : 0;
  const isSpam = fastMsgAmnt >= threshold;
  if (isSpam) fastMsgAmnt = 0;
  spamCache.set(msg.author.id, {
    msgTime: msg.createdTimestamp,
    fastMsgAmnt,
    content: msg.content,
    channelID: msg.channel.id,
  }, 2000);

  if (isSpam) return msg.channel.send("Spam!");
  next();
};

export default antiSpam;

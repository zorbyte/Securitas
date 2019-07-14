import { TCommandMid } from ".";

interface ISpamInfo {
  msgTime: number;
  fastMsgAmnt: number;
  content: string;
  channelID: string;
}

const spamInfo = new Map<string, ISpamInfo>();

const antiSpam: TCommandMid = (msg, ctx, next) => {
  if (msg.author.id === ctx.client.user.id) return next();
  let lastMsg = spamInfo.get(msg.author.id);
  if (!lastMsg) {
    lastMsg = {
      msgTime: 0,
      fastMsgAmnt: 0,
      content: `NOT_SPAM_${msg.content}`,
      channelID: "NOT_SPAM",
    }
  }

  const threshold = ctx.config.spamThreshold;
  let isSpamMsg = (msg.createdTimestamp - lastMsg.msgTime <= 2000) && lastMsg.channelID === msg.channel.id;
  let fastMsgAmnt = isSpamMsg ? lastMsg.fastMsgAmnt + 1 : 0;
  const isSpam = fastMsgAmnt >= (msg.content === lastMsg.content ? ~~(threshold / 2) : threshold);
  if (isSpam) fastMsgAmnt = 0;
  spamInfo.set(msg.author.id, {
    msgTime: msg.createdTimestamp,
    fastMsgAmnt,
    content: msg.content,
    channelID: msg.channel.id,
  });

  if (isSpam) return msg.channel.send("Spam!");
  ctx.spamInfo = spamInfo;
  next();
};

export default antiSpam;

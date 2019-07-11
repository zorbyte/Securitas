import { MessageEmbed, Message } from "discord.js";

export class Reply extends MessageEmbed {
  public static msg: Message;
}

function replyFactory(msg: Message): typeof Reply {
  const ReplyProto = Reply;
  ReplyProto.msg = msg;
  return ReplyProto;
}

export default replyFactory;
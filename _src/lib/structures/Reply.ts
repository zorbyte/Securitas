import { MessageOptions, MessageAttachment, MessageEmbed, Message, User } from "discord.js";
import { Client } from ".";
import { TCmdArgs } from "../../middleware/message/commandDispatcher";

type TTranslationFunc = (...args: any[]) => string;

class Reply {
  public id = this.msg.id;
  public channel = this.msg.channel;
  public content = this.msg.content;
  public author = this.msg.author as User;
  public args?: TCmdArgs;

  public static translations = new Map<string, string | TTranslationFunc>();
  public store: Record<string | number | symbol, any> = {};

  constructor(public msg: Message, public client: Client) { }

  public async send(content?: any, options?: MessageOptions | MessageEmbed | MessageAttachment | (MessageEmbed | MessageAttachment)[] | undefined): Promise<Message | Message[]> {
    return await this.msg.channel.send(content, options);
  }

  public t(name: string, ...args: any[]): string {
    let translation = Reply.translations.get(name);
    if (!translation) throw new Error("No translation found!");
    if (typeof translation === "function") return translation(...args);
    return translation;
  }
}

function replyFactory(msg: Message): typeof Reply {
  const ReplyProto = Reply;
  ReplyProto.msg = msg;
  return ReplyProto;
}

export { Reply };
export default replyFactory;
import { Context, Client, ILogger, TCmdArgs } from "../../lib";
import { IMessage } from ".";
import { Guild } from "../../models";

export class CommandContext extends Context {
  public rawArgs!: string[];
  public prefix!: string;
  public guild?: Guild;
  public args!: TCmdArgs;

  constructor(public client: Client, public msg: IMessage, public config: any, public log: ILogger) {
    super(client);
  }
}

export default CommandContext;

import { Guild } from "../../models";
import { Context, Client, ILogger, TCmdArgs } from "../../lib";
import { IMessage } from ".";

class CommandContext extends Context {
  public rawArgs!: string[];
  public prefix!: string;
  public guild?: Guild;
  public args!: TCmdArgs;

  constructor(public client: Client, public msg: IMessage, public config: any, public log: ILogger) {
    super(client);
  }
}

export default CommandContext;

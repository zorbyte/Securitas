import { Context, Client, ILogger, TCmdArgs } from "../../lib";
import { IMessage } from ".";

export class CommandContext extends Context {
  public rawArgs!: string[];
  public args!: TCmdArgs;

  constructor(public client: Client, public msg: IMessage, public config: any, public log: ILogger) {
    super(client);
  }
}

export default CommandContext;

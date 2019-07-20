import { Guild } from "../../models";
import { Context, Client, Logger, CmdArgs } from "../../lib";
import { CmdMessage } from ".";

class CommandContext extends Context {
  public rawArgs!: string[];
  public prefix!: string;
  public guild?: Guild;
  public args!: CmdArgs;

  constructor(public client: Client, public msg: CmdMessage, public config: any, public log: Logger) {
    super(client);
  }
}

export default CommandContext;

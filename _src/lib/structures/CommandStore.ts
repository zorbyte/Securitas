import { ICommandCtx, TCommandMid, TMessageMid } from "../../middleware/message";

export interface ICommandArgument {
  name: string;
  required: boolean;
  type?: string;
  description?: string;
}

export type TCmdArgs = Record<string, any> | string[];

export interface ICommand {
  name: string;
  aliases?: string[];
  args?: ICommandArgument[];
  run: TCommandMid;
}

export interface IRegisteredCommand extends ICommand {
  category: string;
}

class CommandStore {
  private cmds: Record<string, IRegisteredCommand | string> = {};

  
}
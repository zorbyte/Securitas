import { TMiddleware } from "..";
import { CommandContext } from "../../events/message";

export interface ICommandArgument {
  name: string;
  required: boolean;
  type?: string;
  description?: string;
}

export type TCmdArgs = Record<string, any> | string[];

export type TCommandMid = TMiddleware<CommandContext>;

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
  private items: Record<string, ICommand | string> = {};

  public keys(): string[] {
    return Object.keys(this.items);
  }

  public get(name: string): ICommand | null {
    if (!(name in this.items)) return null;
    let command = this.items[name];
    if (typeof command === "string") command = this.items[command] as ICommand;
    return command;
  }

  public set(command: ICommand): void {
    const { name } = command;
    if (name in this.items) throw new Error("Command already exists!");
    if (command.aliases) {
      command.aliases.forEach((alias: string) => {
        this.items[alias] = command.name;
      });
    }
    this.items[name] = command;
  }

  public *[Symbol.iterator](): IterableIterator<[string, ICommand]> {
    for (const [commandName, command] of Object.entries(this.items)) {
      if (typeof command === "string") continue;
      yield [commandName, command];
    }
  }
}

export default CommandStore;

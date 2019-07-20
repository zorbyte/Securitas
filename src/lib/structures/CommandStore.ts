import { CommandContext } from "../../events/message";
import { Middleware } from "..";

export interface CommandArgument {
  name: string;
  required: boolean;
  type?: string;
  description?: string;
}

export type CmdArgs = Record<string, any> | string[];

export type CommandMid = Middleware<CommandContext>;

export interface Command {
  name: string;
  aliases?: string[];
  args?: CommandArgument[];
  run: CommandMid;
}

export interface RegisteredCommand extends Command {
  category: string;
}

class CommandStore {
  private items: Record<string, Command | string> = {};

  public keys(): string[] {
    return Object.keys(this.items);
  }

  public get(name: string): Command | null {
    if (!(name in this.items)) return null;
    let command = this.items[name];
    if (typeof command === "string") command = this.items[command] as Command;
    return command;
  }

  public set(command: Command): void {
    const { name } = command;
    if (name in this.items) throw new Error("Command already exists!");
    if (command.aliases)
      command.aliases.forEach((alias: string) => {
        this.items[alias] = command.name;
      });

    this.items[name] = command;
  }

  public*[Symbol.iterator](): IterableIterator<[string, Command]> {
    for (const [commandName, command] of Object.entries(this.items)) {
      if (typeof command === "string") continue;
      yield [commandName, command];
    }
  }
}

export default CommandStore;

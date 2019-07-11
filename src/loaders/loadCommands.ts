import { MicroframeworkSettings } from "microframework-w3tec";
import { Util } from "../lib";
import { relative, sep } from "path";

import { ICommand } from "../middleware/message/commandDispatcher";

export interface IRegisteredCommand extends ICommand {
  category: string;
}

async function loadCommands(settings: MicroframeworkSettings): Promise<void> {
  let commands: Record<string, IRegisteredCommand | string> = {};
  await Util.scanDir<ICommand>("commands", (_command, path, scanPath) => {
    let relPaths = relative(scanPath, path).split(sep);
    let command = _command as IRegisteredCommand;
    command.category = relPaths[0];
    commands[command.name] = command;
    if (command.aliases) {
      command.aliases.forEach((alias: string) => {
        commands[alias] = `__ALIAS@${command.name}`;
      });
    }
    return command.name;
  });


  settings.setData("commands", commands);
};

export default loadCommands

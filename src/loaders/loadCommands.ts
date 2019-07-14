import { MicroframeworkSettings } from "microframework-w3tec";
import { relative, sep } from "path";

import { IRegisteredCommand, ICommand, Client } from "../lib";
import { Util } from "../lib";

async function loadCommands(settings: MicroframeworkSettings): Promise<void> {
  let { commands } = settings.getData("client") as Client;
  await Util.scanDir<ICommand>("commands", (_command, path, scanPath) => {
    let relPaths = relative(scanPath, path).split(sep);
    let command = _command as IRegisteredCommand;
    command.category = relPaths[0];
    commands.set(command);
    return command.name;
  });

  settings.setData("commands", commands);
};

export default loadCommands;

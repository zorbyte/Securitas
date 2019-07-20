import { relative, sep } from "path";
import { MicroframeworkSettings } from "microframework-w3tec";

import { RegisteredCommand, Command, Client, Util } from "../lib";

async function loadCommands(settings: MicroframeworkSettings): Promise<void> {
  const { commands } = settings.getData("client") as Client;
  await Util.scanDir<Command>("commands", (_command, path, scanPath) => {
    const relPaths = relative(scanPath, path).split(sep);
    const command = _command as RegisteredCommand;
    command.category = relPaths[0];
    commands.set(command);
    return command.name;
  });

  settings.setData("commands", commands);
}

export default loadCommands;

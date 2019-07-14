import { ICommandCtx, TCommandMid, TMessageMid } from "./";
import { Util } from "../../lib";

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

const commandDispatcher: TMessageMid = async (msg, ctx, next) => {
  // Only reply to valid messages.
  if (!msg.content.startsWith(ctx.config.prefix) || msg.author.bot) return next();

  // Seperate the content.
  let [cmd, ...args] = msg.content.slice(ctx.config.prefix.length)
    .trim()
    .split(/ +/g);
  cmd = cmd.toLowerCase();

  // If there is no string in cmd.
  if (!cmd) return next();
  const { client: { commands } } = ctx;

  // It could potentially be an alias.
  const cmdOrAlias = commands[cmd];
  let command = cmdOrAlias as ICommand;
  if (typeof cmdOrAlias === "string" && cmdOrAlias.startsWith("__ALIAS@")) {
    command = commands[cmdOrAlias.slice("__ALIAS@".length)] as ICommand;
  }

  // If there is no command that matches in the object.
  if (!command) {
    ctx.didYouMean = cmd;
    return next()
  }

  // Build the arguments by matching them with the command info.
  let builtArgs: TCmdArgs = args;
  if (command.args && args.length) {
    builtArgs = {}
    const cmdArgs: any[] = command.args;
    for (const arg in cmdArgs) {
      builtArgs[cmdArgs[arg].name] = args[arg];
    }
  }

  // Set the built args to the context.
  ctx.args = builtArgs;

  // Run the command.
  const incommingData = Util.formatObj({
    name: command.name,
    arguments: (args.length ? args : ["none"]).join(", "),
    parseMatchTime: `${ctx.timer.lap(2)}ms`,
  });
  ctx.log(`Running command.${incommingData}`);
  const cmdRan = command.run(msg, ctx as ICommandCtx, next);
  if (typeof cmdRan.then === 'function') await cmdRan;
  ctx.log(`Successfully ran command ${command.name} in ${ctx.timer.stop(2)}ms.`);
};

export default commandDispatcher;

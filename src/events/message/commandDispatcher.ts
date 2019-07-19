import { TCommandMid, Util } from "../../lib";

export type TCmdArgs = Record<string, any>;

const escapeRegex = (str: string) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const commandDispatcher: TCommandMid = async (ctx, next) => {
  const { msg, client: { user, commands }, prefix } = ctx;
  const prefixRegex = new RegExp(`^(<@!?${user.id}>|${escapeRegex(prefix)})\\s*`);

  // Only reply to valid messages.
  if (!prefixRegex.test(msg.content) || msg.author.bot) return next();

  // @ts-ignore I have no idea what is wrong here.
	const [_, matchedPrefix] = msg.content.match(prefixRegex);

  // Separate the content.
  let [cmd, ...args] = msg.content.slice(matchedPrefix.length)
    .trim()
    .split(/ +/g);
  cmd = cmd.toLowerCase();

  // If there is no string in cmd.
  if (!cmd) return next();

  // Get the command.
  const command = commands.get(cmd)

  // If there is no command that matches in the object.
  if (!command) {
    ctx.didYouMean = cmd;
    return next()
  }

  // Build the arguments by matching them with the command info.
  let builtArgs: TCmdArgs = {};
  if (command.args && args.length) {
    const cmdArgs: any[] = command.args;
    for (const arg in cmdArgs) {
      builtArgs[cmdArgs[arg].name] = args[arg];
    }
  }

  // Set the built args to the context.
  ctx.args = builtArgs;
  ctx.rawArgs = args;

  // Run the command.
  const incomingData = Util.formatObj({
    name: command.name,
    arguments: (args.length ? args : ["none"]).join(", "),
    parseMatchTime: `${ctx.timer.lap(2)}ms`,
  });
  ctx.log(`Running command.${incomingData}`);
  try {
    const cmdRan = command.run(ctx, next);
    if (cmdRan && typeof cmdRan.then === "function") await cmdRan;
  } catch (err) {
    ctx.log.error(`Command ${command.name} failed to run.`, err)
  } finally {
    ctx.log(`Successfully ran command ${command.name} in ${ctx.timer.stop(2)}ms.`);
  }
};

export default commandDispatcher;

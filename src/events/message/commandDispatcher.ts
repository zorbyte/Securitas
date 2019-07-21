import { CommandMid, Util } from "../../lib";

export type CmdArgs = Record<string, any>;

const escapeRegex = (str: string): string => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const commandDispatcher: CommandMid = async (ctx, next): Promise<void> => {
  const { msg, client: { user, commands }, prefix } = ctx;
  const prefixRegex = new RegExp(`^(<@!?${user.id}>|${escapeRegex(prefix)})\\s*`);

  // Only reply to valid messages.
  if (!prefixRegex.test(msg.content) || msg.author.bot) return next();

  const matchedPrefixArr = prefixRegex.exec(msg.content);
  if (!matchedPrefixArr) return next();
  const matchedPrefix = matchedPrefixArr[1];

  // Separate the content.
  let [cmd, ...args] = msg.content.slice(matchedPrefix.length)
    .trim()
    .split(/ +/g);
  cmd = cmd.toLowerCase();

  // If there is no string in cmd.
  if (!cmd) return next();

  // Get the command.
  const command = commands.get(cmd);

  // If there is no command that matches in the object.
  if (!command) {
    ctx.didYouMean = cmd;
    return next();
  }

  // Stop unauthorised users.
  if (command.permission > 0 && await Util.getUserPerm(msg.author.id) < command.permission) return next();

  // Build the arguments by matching them with the command info.
  const builtArgs: CmdArgs = {};
  if (command.args && args.length) {
    // eslint-ignore-next-line guard-for-in
    let i = 0;
    for (const arg of command.args) {
      builtArgs[arg.name] = args[i];
      i++;
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
  } catch (error) {
    ctx.log.error(`Command ${command.name} failed to run.`, error);
    await msg.channel.send(`The command failed to run, this error has been reported.`)
      .catch(ctx.log.error);
  } finally {
    ctx.log(`Successfully ran command ${command.name} in ${ctx.timer.stop(2)}ms.`);
  }
};

export default commandDispatcher;

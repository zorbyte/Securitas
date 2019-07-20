import { Command } from "../../lib";

const clean = (text: string): string => {
  if (typeof (text) === "string")
    return text.replace(/`/g, `\`${String.fromCharCode(8203)}`).replace(/@/g, `@${String.fromCharCode(8203)}`);
  return text;
};

const evalCmd: Command = {
  name: "eval",
  aliases: ["ev"],
  args: [{
    name: "...code",
    required: true,
  }],
  run(ctx) {
    const { msg, rawArgs, config } = ctx;
    try {
      if (msg.author.id !== config.ownerID) return;
      const code = rawArgs.join(" ");
      // eslint-disable-next-line no-eval
      let evaled = eval(code);

      if (typeof evaled !== "string") evaled = require("util").inspect(evaled);

      msg.channel.send(clean(evaled), { code: "xl" });
    } catch (error) {
      msg.channel.send(`\`ERROR\` \`\`\`xl\n${clean(error)}\n\`\`\``);
    }
  },
};

export default evalCmd;

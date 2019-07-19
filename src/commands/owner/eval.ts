import { ICommand } from "../../lib";

const clean = (text: string) => {
  if (typeof(text) === "string")
    return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
  else
      return text;
}

const evalCmd: ICommand = {
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
      let evaled = eval(code);
 
      if (typeof evaled !== "string") evaled = require("util").inspect(evaled);
 
      msg.channel.send(clean(evaled), { code:"xl" });
    } catch (err) {
      msg.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
    }
  },
}

export default evalCmd;

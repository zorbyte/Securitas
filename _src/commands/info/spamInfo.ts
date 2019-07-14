import { ICommand } from "../../middleware/message/commandDispatcher";
import { inspect } from "util";

const ping: ICommand = {
  name: "spaminfo",
  aliases: ["spam", "s"],
  run(msg, { spamInfo }) {
    msg.channel.send(`\`\`\`js\n${inspect(spamInfo)}\`\`\``);
  },
}

export default ping;

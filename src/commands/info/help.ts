import { ICommand } from "../../middleware/message/commandDispatcher";

const help: ICommand = {
  name: "help",
  aliases: ["h", "cmds"],
  args: [{
    name: "commands",
    required: false,
  }],
  run(msg, { client }) {
    msg.reply(`sup \`\`\`json\n${JSON.stringify(client.commands, null, 2)}\`\`\``);
  }
}

export default help;

import { MessageEmbed } from "discord.js";

import { ICommand } from "../../lib";

const help: ICommand = {
  name: "help",
  aliases: ["h", "cmds"],
  args: [{
    name: "command",
    required: false,
  }],
  run(ctx, next) {
    const { msg, args, client, config } = ctx;
    const embed = new MessageEmbed();

    if (!Array.isArray(args) && args.command) {
      const command = client.commands.get(args.command);

      if (!command) {
        ctx.didYouMean = args.command;
        return next();
      }

      let helpArgs = "";
      if (command.args) helpArgs += command.args
        .map(arg => {
          const [start, end] = [["[", "]"], ["<", ">"]][arg.required ? 1 : 0];
          return ` ${start}${arg.name}${end}`;
        })
        .join(" ");

      embed
        .setTitle(command.name)
        .setDescription(`${config.prefix}${command.name}${helpArgs}`);
    } else {
      embed
        .setTitle("Help")
        .setDescription("**Arguments key:**")
        .addField("Optional", "[]")
        .addField("Required", "<>");

      for (const [name, cmdEntry] of client.commands) {
        let helpArgs = "";
        if (cmdEntry.args) helpArgs += cmdEntry.args
          .map(arg => {
            const [start, end] = [["[", "]"], ["<", ">"]][arg.required ? 1 : 0];
            return ` ${start}${arg.name}${end}`;
          })
          .join(" ");

        embed.addField(name, `${config.prefix}${name}${helpArgs}`, false);
      }
    }

    msg.channel.send(embed);
  },
};

export default help;

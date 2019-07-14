import { ICommand } from "../../middleware/message/commandDispatcher";
import { MessageEmbed } from "discord.js";

const help: ICommand = {
  name: "help",
  aliases: ["h", "cmds"],
  args: [{
    name: "command",
    required: false,
  }],
  run(msg, ctx, next) {
    const { args, client, config } = ctx;
    const embed = new MessageEmbed();

    if (!Array.isArray(args) && args.command) {
      // Move this to its own file later.

      // It could potentially be an alias.
      const cmdOrAlias = client.commands[args.command];
      let command = cmdOrAlias as ICommand;
      if (typeof cmdOrAlias === "string" && cmdOrAlias.startsWith("__ALIAS@")) {
        command = client.commands[cmdOrAlias.slice("__ALIAS@".length)] as ICommand;
      }

      // If there is no command that matches in the object.
      if (!command) {
        ctx.didYouMean = args.command;
        return next()
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
    
      for (const [name, cmdEntry] of Object.entries(client.commands)) {
        if (typeof cmdEntry === "string") continue;
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

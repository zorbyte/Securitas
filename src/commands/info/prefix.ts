import { Command, Driver } from "../../lib";

const prefix: Command = {
  name: "prefix",
  aliases: ["pr"],
  args: [{
    name: "new prefix",
    required: false,
  }],
  permission: 0,
  async run({ msg, args, prefix }) {
    if (msg.guild && args["new prefix"]) {
      await Driver.updateGuild(msg.guild.id, {
        prefix: args["new prefix"],
      });
      await msg.channel.send(`The new prefix is **${args["new prefix"]}**.`);
      return;
    }
    msg.channel.send(`The prefix is **${prefix}**.`);
  },
};

export default prefix;

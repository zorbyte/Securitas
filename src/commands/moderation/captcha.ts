import captchaGen = require("captchagen");
import { MessageAttachment } from "discord.js";

import { Command } from "../../lib";

const captchaCmd: Command = {
  name: "captcha",
  permission: 1,
  aliases: ["c"],
  run({ msg }) {
    const captcha = captchaGen.create();
    captcha.generate();

    const img = new MessageAttachment(captcha.buffer(), "Captcha.png");

    msg.channel.send(`Solve text: ${captcha.text()}`, img);
  },
};

export default captchaCmd;

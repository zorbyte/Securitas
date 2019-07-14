import captchaGen = require("captchagen");
import { MessageAttachment } from "discord.js";

import { ICommand } from "../../lib";

const captchaCmd: ICommand = {
  name: "captcha",
  aliases: ["c"],
  async run(msg) {
    const captcha = captchaGen.create();
    captcha.generate();

    const img = new MessageAttachment(captcha.buffer(), "Captcha.png")

    msg.channel.send(`Solve text: ${captcha.text()}`, img);
  }
}

export default captchaCmd;

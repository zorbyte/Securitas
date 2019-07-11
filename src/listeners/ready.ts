import createDebug from "debug";
import { ClientUser } from "discord.js";

import { TListener } from "../loaders/loadListeners";
import { Util } from "../lib";

const debug = createDebug("DeX:events:ready");
const readyListener: TListener = client => client.once("ready", () => {
  const botInfo = Util.formatObj({
    tag: (client.user as ClientUser).tag,
    guildCount: client.guilds.size,
    userCount: client.users.size,
  });

  debug(`Bot is ready!${botInfo}`);
});

export default readyListener;

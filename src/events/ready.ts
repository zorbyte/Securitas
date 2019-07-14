import { TListener } from "../loaders/loadEvents";
import { Util, createLogger } from "../lib";

const log = createLogger("events:ready");
const readyListener: TListener = client => client.on("ready", () => {
  const botInfo = Util.formatObj({
    tag: client.user.tag,
    guildCount: client.guilds.size,
    userCount: client.users.size,
  });

  log(`Bot is ready!${botInfo}`);

  client.user.setPresence({
    activity: {
      name: "you!",
      type: "WATCHING",
    },
  });
});

export default readyListener;

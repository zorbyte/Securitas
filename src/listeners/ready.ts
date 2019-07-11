import { TListener } from "../loaders/loadListeners";

const debug = require("debug")("DeX:events:ready");
const readyListener: TListener = client => client.once("ready", () => {
  debug(`Ready! Guilds ${client.guilds.size}`);
});

export default readyListener;

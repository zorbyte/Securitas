import { TListener } from "../loaders/loadListeners";
import { createLogger, DeXError } from "../lib";

const log = createLogger("events:error");
const readyListener: TListener = client => client.on("error", error => {
  log.error("An error has occurred!", new DeXError("DISCORD_ERROR", error));
});

export default readyListener;

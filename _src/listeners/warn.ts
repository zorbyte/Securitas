import { TListener } from "../loaders/loadListeners";
import { createLogger } from "../lib";

const log = createLogger("events:warn");
const readyListener: TListener = client => client.on("warn", warn => {
  log("A warning has occurred!", warn);
});

export default readyListener;

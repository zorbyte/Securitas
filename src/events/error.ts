import { TListener } from "../loaders/loadEvents";
import { createLogger } from "../lib";

const log = createLogger("events:error");
const readyListener: TListener = client => client.on("error", (error: any) => {
  log.error("An error has occurred!", error.message);
});

export default readyListener;

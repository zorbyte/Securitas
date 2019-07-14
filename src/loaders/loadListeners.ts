import { MicroframeworkSettings } from "microframework-w3tec";
import { Client, Util } from "../lib";

// Use the client so data and event types are still available.
export type TListener = (client: Client) => Client;

const loadListeners = (settings: MicroframeworkSettings): Promise<void[]> =>
  Util.scanDir<TListener>("listeners", (listener, path, scanPath, log) => {
    const listenerName = path.slice(scanPath.length + 1, -3);

    // Ignore malformed listeners.
    if (typeof listener !== "function") {
      log(`Listener ${listenerName} is malformed... ignoring!`)
      return;
    };

    // Run the listener registration function.
    listener(settings.getData("client"));

    // Return the name for logging purposes.
    return listenerName;
  });

export default loadListeners;

import { sep } from "path";
import { MicroframeworkSettings } from "microframework-w3tec";

import { Client, Util } from "../lib";

// Use the client so data and event types are still available.
export type TListener = (client: Client) => Client;

const loadEvents = (settings: MicroframeworkSettings): Promise<void> =>
  Util.scanDir<TListener>("events", (listener, path, scanPath, log) => {
    let listenerName = path.slice(scanPath.length + 1, -3);
    const separatedName = listenerName.split(sep);
    if (separatedName.length > 1) {
      if (separatedName[1] !== "index") return;
      listenerName = separatedName[0];
    }

    // Ignore malformed listeners.
    if (typeof listener !== "function") {
      log(`Event ${listenerName} is malformed... ignoring!`);
      return;
    }

    // Run the listener registration function.
    listener(settings.getData("client"));

    // Return the name for logging purposes.
    return listenerName;
  });

export default loadEvents;

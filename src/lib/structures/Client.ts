import { Client, Message } from "discord.js";
import {
  bootstrapMicroframework,
  MicroframeworkLoader,
  MicroframeworkSettings,
  Microframework,
} from "microframework-w3tec";
import createDebug from "debug";
import ow from "ow";

import loaders from "../../loaders";
import { Stack, Stopwatch, Util } from "..";
import {
  TMessageMid,
  IMessageCtx,
  ICommandCtx,
  TCommandMid,
} from "../../middleware/message";
import { IRegisteredCommand } from "../../loaders/loadCommands";

const debug = createDebug("DeX:client");

class DeXClient extends Client {
  public commands!: Record<string, IRegisteredCommand | string>;
  public messageStack = new Stack<Message, IMessageCtx & ICommandCtx>();

  private micro!: Microframework;

  private async bootstrap(): Promise<Stopwatch | undefined> {
    try {
      debug("Starting bootstrapping process.");
      const bootTimer = new Stopwatch();
      this.micro = await bootstrapMicroframework([
        async (settings: MicroframeworkSettings) => {
          settings.setData("client", this);
          settings.onShutdown(() => super.destroy());

          // Compose middleware.
          this.messageStack.compose();
        },
        ...loaders,
      ] as MicroframeworkLoader[]);
      bootTimer.lap(2);

      this.commands = this.micro.settings.getData("commands") || {};
      return bootTimer;
    } catch (err) {
      debug("An error occurred while bootstrapping.");
      Util.logError(err);
    }
  }

  public use(fn: TMessageMid | TCommandMid): DeXClient {
    ow(fn, ow.function);
    this.messageStack.use(fn);
    if (!!this.readyAt) this.messageStack.compose();
    return this;
  }

  public async login(token = process.env.TOKEN): Promise<string> {
    // Start bootstrapping.
    const bootTimer = await this.bootstrap();

    // If there is no timer that means there is an error.
    if (!bootTimer) return process.exit(1);
    const bootstrapTime = bootTimer.get(0);
    debug(`Bootstrap completed in ${bootstrapTime}ms.`);

    // Login.
    const tokenPartial = token ? token.substr(0, 13) : "";
    debug(`Logging in with ${token ? `token ${tokenPartial}${"*".repeat(token.length - ~~(tokenPartial.length * 2.75))}` : "an unknown token"}.`);
    const loginResp = await super.login(token);

    // Timers.
    const totalTime = bootTimer.stop();
    const loginTime = parseFloat(totalTime) - parseFloat(bootstrapTime);
    debug(`Successfuly logged in with a total boot time of ${totalTime}ms and login time of ${loginTime}ms.`);
    return loginResp;
  }

  public async destroy() {
    if (this.micro) {
      await this.micro.shutdown();
    } else {
      super.destroy();
    }
  }
}

export default DeXClient;

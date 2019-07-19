import { Client, ClientUser } from "discord.js";
import {
  bootstrapMicroframework,
  MicroframeworkLoader,
  MicroframeworkSettings,
  Microframework,
} from "microframework-w3tec";
import Keyv = require("keyv");
import { RethinkAdapter } from "pims-rethinkdb";
import ow from "ow";

import loaders from "../../loaders";
import {
  TCommandMid,
  CommandStore,
  Stack,
  Stopwatch,
  createLogger,
} from "..";
import { CommandContext, ISpamInfo } from "../../events/message"

class SecuritasClient extends Client {
  public commands = new CommandStore();
  public messageStack = new Stack<typeof CommandContext>();
  public redisCache!: Keyv<ISpamInfo>;
  public adapter!: RethinkAdapter;
  public log = createLogger("client");

  private micro!: Microframework;

  // Fixes Discord.js types.
  public user!: ClientUser;

  private async bootstrap(): Promise<Stopwatch | undefined> {
    try {
      this.log("Starting bootstrapping process.");
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

      this.redisCache = this.micro.settings.getData("cache");
      this.adapter = this.micro.settings.getData("adapter");
      this.commands = this.micro.settings.getData("commands") || {};
      return bootTimer;
    } catch (err) {
      this.log.error("An error occurred while bootstrapping.", err);
      process.exit(1);
    }
  }

  public use(fn: TCommandMid): SecuritasClient {
    ow(fn, ow.function);
    this.messageStack.use(fn);
    if (!!this.readyAt) this.messageStack.compose();
    return this;
  }

  public async login(token = process.env.TOKEN): Promise<string> {
    try {
      // Start bootstrapping.
      const bootTimer = await this.bootstrap();

      // If there is no timer that means there is an error.
      if (!bootTimer) return process.exit(1);
      const bootstrapTime = bootTimer.get(0);
      this.log(`Bootstrap completed in ${bootstrapTime}ms.`);

      // Login.
      const tokenPartial = token ? token.substr(0, 13) : "";
      this.log(`Logging in with ${token ? `token ${tokenPartial}${"*".repeat(token.length - ~~(tokenPartial.length * 2.75))}` : "an unknown token"}.`);
      let loginResp = await super.login(token)
        .catch(err => {
          this.log.error(`Failed to log into Discord.`, err);
          process.exit(1);
        });
      
      loginResp = loginResp as string;

      // Timers.
      const totalTime = bootTimer.stop();
      const loginTime = parseFloat(totalTime) - parseFloat(bootstrapTime);
      this.log(`Successfully logged in with a total boot time of ${totalTime}ms and login time of ${loginTime}ms.`);
      return loginResp;
    } catch (err) {
      throw err;
    }
  }

  public async destroy() {
    if (this.micro) {
      await this.micro.shutdown();
    } else {
      super.destroy();
    }
  }
}

export default SecuritasClient;

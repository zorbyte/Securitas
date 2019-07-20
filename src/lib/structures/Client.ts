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
import { CommandContext, SpamInfo } from "../../events/message";
import {
  CommandMid,
  CommandStore,
  Stack,
  Stopwatch,
  createLogger,
} from "..";

class SecuritasClient extends Client {
  public commands = new CommandStore();
  public messageStack = new Stack<typeof CommandContext>();
  public redisCache!: Keyv<SpamInfo>;
  public adapter!: RethinkAdapter;
  public log = createLogger("client");

  private micro!: Microframework;

  // Fixes Discord.js types.
  public user!: ClientUser;

  private async bootstrap(): Promise<Stopwatch> {
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
  }

  public use(fn: CommandMid): SecuritasClient {
    ow(fn, ow.function);
    this.messageStack.use(fn);
    if (this.readyAt) this.messageStack.compose();
    return this;
  }

  public async login(token = process.env.TOKEN): Promise<string> {
    // Start bootstrapping.
    const bootTimer = await this.bootstrap();

    // If there is no timer that means there is an error.
    const bootstrapTime = bootTimer.get(0);
    this.log(`Bootstrap completed in ${bootstrapTime}ms.`);

    // Login.
    const tokenPartial = token ? token.substr(0, 13) : "";
    this.log(`Logging in with ${token ? `token ${tokenPartial}${"*".repeat(token.length - ~~(tokenPartial.length * 2.75))}` : "an unknown token"}.`);
    const loginResp = await super.login(token);

    // Timers.
    const totalTime = bootTimer.stop();
    const loginTime = parseFloat(totalTime) - parseFloat(bootstrapTime);
    this.log(`Successfully logged in with a total boot time of ${totalTime}ms and login time of ${loginTime}ms.`);
    return loginResp;
  }

  public async destroy(): Promise<void> {
    if (this.micro)
      await this.micro.shutdown();
    else
      super.destroy();
  }
}

export default SecuritasClient;

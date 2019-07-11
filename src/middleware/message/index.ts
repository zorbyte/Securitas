import { Message } from "discord.js";
import { Debugger } from "debug";
import { TMiddleware as TMiddlewareGeneric, IMiddlewareCtx } from "../../lib/structures/Stack";
import commandDispatcher, { TCmdArgs, ICommand } from "./commandDispatcher";

export { default as didYouMean } from "./didYouMean";
export { commandDispatcher, ICommand };

export interface IMessageCtx extends IMiddlewareCtx {
  debug: Debugger;
  serverDocument?: { wip: "Not Ready Yet" };
  userDocument?: { wip: "Not Ready Yet" };
  potentialSpam: boolean;
}

export interface ICommandCtx extends IMessageCtx {
  args: TCmdArgs;
}

export type TMessageMid = TMiddlewareGeneric<Message, IMessageCtx>;
export type TCommandMid = TMiddlewareGeneric<Message, ICommandCtx>;

import { Message, User } from "discord.js";

import { TMiddleware as TMiddlewareGeneric, IMiddlewareCtx, ILogger } from "../../lib";
import commandDispatcher, { TCmdArgs, ICommand } from "./_commandDispatcher";

export { default as antiSpam } from "./antiSpam";
export { default as didYouMean } from "./didYouMean";
export { commandDispatcher, ICommand };

export interface IMessage extends Message {
  author: User;
}

export interface IMessageCtx extends IMiddlewareCtx {
  log: ILogger;
  config: any;
  serverDocument?: { wip: "Not Ready Yet" };
  userDocument?: { wip: "Not Ready Yet" };
  potentialSpam: boolean;
}

export interface ICommandCtx extends IMessageCtx {
  args: TCmdArgs;
  author: User;
}

export type TMessageMid = TMiddlewareGeneric<IMessage, IMessageCtx>;
export type TCommandMid = TMiddlewareGeneric<IMessage, ICommandCtx>;

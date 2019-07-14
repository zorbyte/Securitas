import compose = require("koa-compose");
import { Stopwatch, Client } from "..";

export type TNextFn = () => Promise<any>;
export type TMiddleware<T, C > = (data: T, ctx: C, next: TNextFn) => any;
export interface IMiddlewareCtx {
  client: Client;
  timer: Stopwatch;
  [key: string]: any;
}

// Internal types.
interface IRegisterCtx<T> {
  data: T;
  ctx: IMiddlewareCtx;
}

interface IMiddlewareFn<T, C> extends compose.Middleware<IRegisterCtx<T>> {
  fn: TMiddleware<T, C>;
}

class Stack<T, C extends IMiddlewareCtx> {
  private composed = false;
  private middleware: IMiddlewareFn<T, C>[] = [];
  private composedMiddleware!: compose.ComposedMiddleware<IRegisterCtx<T>>;

  public use(fn: TMiddleware<T, C>): Stack<T, C> {
    let mdFn: any = async (ctx: IMiddlewareCtx, next: TNextFn) => {
      await mdFn.fn(ctx.data, ctx.ctx, next);
    };

    // Assign it instead of directly using it so that it can be disused later.
    mdFn.fn = fn;

    this.middleware.push(mdFn as IMiddlewareFn<T, C>);
    return this;
  }

  public disuse(fn: TMiddleware<T, C>): Stack<T, C> {
    this.middleware = this.middleware.filter(mdFn => mdFn.fn.toString() !== fn.toString());
    this.compose();
    return this;
  }

  public get handler() {
    if (!this.composed) throw new Error("Middleware stack has not been composed!");
    return this.composedMiddleware;
  }

  public compose() {
    this.composedMiddleware = compose<IRegisterCtx<T>>(this.middleware);
    this.composed = true;
  }
}

export default Stack;

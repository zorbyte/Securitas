import compose = require("koa-compose");
import { Context } from "./";

type TNextFn = () => Promise<any>;
export type TMiddleware<CI> = compose.Middleware<CI>;

interface IMiddlewareFn<C, CI> extends TMiddleware<C> {
  fn: TMiddleware<CI>;
}

interface $TSFIX_IAnyCtx {
  new (...args: any): any
}

/**
 * @type C The constructor type of the context
 * @type CI The instance of C.
 */
class Stack<C extends (typeof Context) | $TSFIX_IAnyCtx, CI = InstanceType<C>> {
  private composed = false;
  private middleware: IMiddlewareFn<C, CI>[] = [];
  private composedMiddleware!: compose.ComposedMiddleware<C>;

  public use(fn: TMiddleware<CI>): Stack<C, CI> {
    let mdFn: any = async (ctx: CI, next: TNextFn) => {
      await mdFn.fn(ctx, next);
    };

    // Assign it instead of directly using it so that it can be disused later.
    mdFn.fn = fn;

    this.middleware.push(mdFn as IMiddlewareFn<C, CI>);
    return this;
  }

  public disuse(fn: TMiddleware<C>): Stack<C, CI> {
    this.middleware = this.middleware.filter(mdFn => mdFn.fn.toString() !== fn.toString());
    this.compose();
    return this;
  }

  public get handler(): compose.ComposedMiddleware<CI> {
    if (!this.composed) throw new Error("Middleware stack has not been composed!");
    return this.composedMiddleware as unknown as compose.ComposedMiddleware<CI>;
  }

  public compose() {
    this.composedMiddleware = compose<C>(this.middleware);
    this.composed = true;
  }
}

export default Stack;

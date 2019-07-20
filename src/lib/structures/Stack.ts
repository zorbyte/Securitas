import compose = require("koa-compose");
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Context } from ".";

type NextFn = () => Promise<any>;
export type Middleware<CI> = compose.Middleware<CI>;

interface MiddlewareFn<C, CI> extends Middleware<C> {
  fn: Middleware<CI>;
}

type $TSFIXAnyCtx = new (...args: any) => any;

/**
 * @type C The constructor type of the context
 * @type CI The instance of C.
 */
class Stack<C extends (typeof Context) | $TSFIXAnyCtx, CI = InstanceType<C>> {
  private composed = false;
  private middleware: Array<MiddlewareFn<C, CI>> = [];
  private composedMiddleware!: compose.ComposedMiddleware<C>;

  public use(fn: Middleware<CI>): Stack<C, CI> {
    const mdFn: any = async (ctx: CI, next: NextFn) => {
      await mdFn.fn(ctx, next);
    };

    // Assign it instead of directly using it so that it can be disused later.
    mdFn.fn = fn;

    this.middleware.push(mdFn as MiddlewareFn<C, CI>);
    return this;
  }

  public disuse(fn: Middleware<C>): Stack<C, CI> {
    this.middleware = this.middleware.filter(mdFn => mdFn.fn.toString() !== fn.toString());
    this.compose();
    return this;
  }

  public get handler(): compose.ComposedMiddleware<CI> {
    if (!this.composed) throw new Error("Middleware stack has not been composed!");
    return this.composedMiddleware as unknown as compose.ComposedMiddleware<CI>;
  }

  public compose(): void {
    this.composedMiddleware = compose<C>(this.middleware);
    this.composed = true;
  }
}

export default Stack;

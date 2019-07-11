/**
 * @see https://github.com/GilbertGobbels/GAwesomeBot/blob/indev-4.0.2/Internals/Errors/GABError.js
 * @author GAwesomeBot Authors
 * @license GPL v2.0
 * @description Modified version of linked one above.
 */

import { isError } from "util";
import cleanStack = require("clean-stack");

export type TVal = (...args: any[]) => string;

const kCode = Symbol("DeXError.code");
const messages = new Map<string, string | TVal>();

const createError = (Base: any) => class DeXError extends Base {
  private [kCode]: string;

  constructor(key: string, ...args: any[]) {
    super(message(key, args));
    this[kCode] = key;
    if (Error.captureStackTrace) Error.captureStackTrace(this, DeXError);

    // @ts-ignore
    this.stack = cleanStack(this.stack);
  }

  public get name() {
    return `${super.name} [${this[kCode]}]`;
  }

  public get code() {
    return this[kCode];
  }
};

function message(key: string, args: any[]): string {
  if (typeof key !== "string") throw new Error("Error message key must be a string");
  const msg = messages.get(key);
  //if (!msg) throw new Error(`An invalid error message key was used: ${key}.`);
  if (typeof msg === "function") return msg(...args);
  if (msg && (args === undefined || args.length === 0)) return msg;
  if (msg) args.unshift(msg);
  args = args.map(item => {
    if (isError(item)) return item.stack ? item.stack.split(": ").splice(1).join(": ") : item.message;
    return item;
  });

  return String(...args);
};

function register(sym: string, val: string | TVal): Map<string, string | TVal> {
  return messages.set(sym, typeof val === "function" ? val : String(val));
}

const DeXError = createError(Error);
const DeXTypeError = createError(TypeError);
const DeXRangeError = createError(RangeError);

export {
  register,
  DeXError,
  DeXTypeError,
  DeXRangeError,
};

import chalk from "chalk";
import debug from "debug";
import cleanStack = require("clean-stack");
import { isError } from "util";

export const kFormat = Symbol.for("logger.Format");

export interface ILogger {
  child(loggerName: string): ILogger;
  error(...errorData: Array<Error & any>): void;
  [kFormat](isErrorMsg: boolean, ...data: any[]): string;
  (...data: any[]): ILogger;
}

const [colStart, colEnd] = chalk.red("_").split("_");

function colouriseName(name: string): string {
  // @ts-ignore Setup colours, this is a hidden debug API.
  const colourNum = debug.selectColor(name);
  const colourCode = `\u001B[3${(colourNum < 8 ? colourNum : `8;5;${colourNum}`)};1m`;
  const useCol = chalk.supportsColor;
  return `${useCol ? colourCode : ""}${name}${useCol ? "\u001B[0m" : ""}`;
}

function createLogger(name: string): ILogger;
function createLogger(loggerName: string): ILogger {
  function formatMessage(name: string, isErrorMsg: boolean, ...data: any[]): string {
    if (isErrorMsg)
      data = data
        .map((arg, ind) => {
          const res = isError(arg) ? cleanStack(arg.stack as string, { pretty: true }) : arg;
          return ind === 0 ? res : `\n${res}`;
        });

    // Colours.
    const iColStart = isErrorMsg ? colStart : "";
    const iColEnd = isErrorMsg ? colEnd : "";

    data = data
      .join("")
      .split("\n")
      .map((line, ind) => {
        line = `${iColStart}${line.trimEnd()}${iColEnd}`;
        return ind === 0 ? line : `\n  ${name} ${line}`;
      })
      .filter(val => val !== "\n" ? val : void 0);

    return `  ${name} ${data.join(" ")}`;
  }

  function logMessage(name: string, isErrorMsg: boolean, ...data: any[]): void {
    const logData = formatMessage(name, isErrorMsg, ...data);
    console[isErrorMsg ? "error" : "debug"](logData);
  }

  function logError(name: string, ...data: any[]): void {
    logMessage(name, true, ...data);
  }

  function logger(name: string, ...data: any[]): void {
    if (process.env.NODE_ENV === "production") return;
    logMessage(name, false, ...data);
  }

  // Avoid calling the create logger function again because of the speed benefits.
  function createChild(name: string, childName?: string): ILogger {
    if (childName) name = `${name}:${childName}`;
    name = colouriseName(name);
    const loggerInst = logger.bind(null, name) as ILogger;
    loggerInst.error = logError.bind(null, name);
    loggerInst.child = createChild.bind(null, name);
    loggerInst[kFormat] = formatMessage.bind(null, name);
    return loggerInst;
  }

  return createChild(loggerName);
}

export default createLogger;

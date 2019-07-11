import { scan } from "fs-nextra";
import chalk from "chalk";
import { inspect } from "util";
import { join, extname } from "path";
import createDebug, { Debugger } from "debug";

/**
 * @returns [string] The name of the item.
 */
type TLoadFunc<T> = (item: T, path: string, scanPath: string, debug: Debugger) => Promise<string | undefined> | string | undefined;

class Util {
  public static formatObj(obj: Record<string, string | number>): string {
    let builtString = "\n";
    for (const [key, value] of Object.entries(obj)) builtString += `\t${key}=${chalk.green(inspect(value))}\n`;
    return builtString.trimEnd();
  }

  public static truncateStr(str: string, maxLength = 12): string {
    return str.replace(new RegExp(`(.{${maxLength - 1}})..+`), "$1...");
  }

  public static logError(error: Error & any): void {
    console.error(chalk.red(error.stack));
  }

  public static async scanDir<T>(componentType: string, loadFunc: TLoadFunc<T>): Promise<void[]> {
    const debug = createDebug(`DeX:loader:${componentType}`);

    debug(`Scanning ${componentType} directory.`);
    const scanPath = join(__dirname, "..", "..", componentType);
    const filePaths = await scan(scanPath, {
      filter: (stats, path) => stats.isFile() && extname(path) === ".js",
    });

    return await Promise.all([...filePaths.keys()]
      .map(async filePath => {
        const { default: component }: { default: T } = await import(filePath);

        const componentName = await loadFunc(component, filePath, scanPath, debug);
        if (componentName) {
          const displayTypeName = componentType.endsWith("s")
            ? componentType.slice(0, -1)
            : componentType;
          debug(`Loaded ${displayTypeName} ${componentName}.`);
        }

        // Don't reserve unnecesary memory.
        module.children.pop();
        delete require.cache[filePath];
      }));
  }
}

export default Util;

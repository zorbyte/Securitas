import { inspect } from "util";
import { join, extname } from "path";
import { scan } from "fs-nextra";
import chalk from "chalk";
import {
  createLogger,
  Logger,
  Driver,
  Stopwatch,
  Permissions,
} from "..";

/**
 * @returns [string] The name of the item.
 */
type LoadFunc<T> = (item: T, path: string, scanPath: string, log: Logger) => Promise<string | undefined> | string | undefined;

class Util {
  public static async getUserPerm(userId: string, guildId?: string): Promise<Permissions> {
    const user = await Driver.fetchUser(userId);
    if (!user) return 0;
    if (user.isMaintainer) return 4;
    if (!guildId) return 0;
    if (user.guilds) {
      const userGuild = user.guilds.find(g => g.id === guildId);
      if (!userGuild) return 0;
      return userGuild.perm || 0;
    }
    return 0;
  }

  public static formatObj(obj: Record<string, string | number>): string {
    let builtString = "\n";
    for (const [key, value] of Object.entries(obj)) builtString += `\t${key}=${chalk.green(
      typeof value === "object"
        ? "..."
        : inspect(value)
    )}\n`;
    return builtString.trimEnd();
  }

  public static truncateStr(str: string, maxLength = 12): string {
    return str.replace(new RegExp(`(.{${maxLength - 1}})..+`), "$1...");
  }

  public static async scanDir<T>(componentType: string, loadFunc: LoadFunc<T>): Promise<void> {
    const log = createLogger(`loader:${componentType}`);
    const displayTypeName = componentType.endsWith("s")
      ? componentType.slice(0, -1)
      : componentType;

    log(`Scanning ${componentType} directory.`);
    const scanPath = join(__dirname, "..", "..", componentType);

    const timer = new Stopwatch();
    const filePaths = await scan(scanPath, {
      filter: (stats, path) => stats.isFile() && extname(path) === ".js",
    });

    await Promise.all([...filePaths.keys()]
      .map(async filePath => {
        const { default: component }: { default: T } = await import(filePath);

        const componentName = await loadFunc(component, filePath, scanPath, log);
        if (componentName)
          log(`Loaded ${displayTypeName} ${componentName}.`);

        // Don't reserve unnecessary memory.
        module.children.pop();
        delete require.cache[filePath];
      }));

    log(`Finished loading ${componentType} in ${timer.stop(2)}ms.`);
  }
}

export default Util;

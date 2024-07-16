import { join } from "path";
import Config from "./config";
import { readdirSync, statSync } from "fs";

/**
 * get all weapon files in a directory and its subdirectories
 * @param basePath Directory to search for weapon files
 * @returns a list of paths to weapon files
 */
function getWeaponPaths(
  basePath = "./CalamityModPublic/Items/Weapons",
): string[] {
  let foundPaths: string[] = [];
  foundPaths.concat(Config.force);
  const paths = readdirSync(basePath);

  for (const path of paths) {
    const fullPath = join(basePath, path);
    const stats = statSync(fullPath);
    if (stats.isDirectory()) {
      foundPaths = foundPaths.concat(getWeaponPaths(fullPath));
    } else {
      if (Config.ignore.includes(path) || !path.endsWith(".cs")) {
        continue;
      }
      foundPaths.push(fullPath);
    }
  }

  return foundPaths;
}

/**
 *
 * @param fc File content of the weapon to parse
 * @param weaponName Name of the weapon for error handling
 * @returns a key value pair for the default stats of the weapon
 */
function getDefaults(
  fc: string,
  weaponName: string,
): { [key: string]: string | number } {
  let result: { [key: string]: string | number } = {};

  const defaults = fc.match(/SetDefaults\(\)[\w\W]*?}\n/gim);

  if (!defaults) {
    throw new Error("Unable to find defaults " + weaponName);
  }

  defaults[0]
    .split("\n")
    .map((stat) => stat.trim().replace(/;/g, ""))
    .filter(Boolean)
    .slice(2, -1)
    .forEach((item) => {
      const splits = item.split("=");
      if (splits.length > 2) {
        const keys = splits.slice(0, -1);
        const value = splits.slice(-1)[0];
        keys.forEach((key) => {
          result[key.trim().split("Item.")[1]] = parseDataType(value.trim());
        });
      } else {
        const key = splits[0].trim().split("Item.")[1];
        const value = parseDataType(splits[1].trim());
        result[key] = value;
      }
    });

  return result;
}

/**
 *
 * @param data Data to parse
 * @returns a sting or number based on the data
 */
function parseDataType(data: string): string | number {
  const numberRegex = /(-?\d+\.?\d*)f?/i;
  const match = data.match(numberRegex);
  if (match) {
    return parseFloat(match[0]);
  } else {
    return data;
  }
}

export { getWeaponPaths, getDefaults };

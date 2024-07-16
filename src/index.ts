import { readFileSync } from "fs";
import { getWeaponPaths, getDefaults } from "./utils";
import type { Weapon } from "./types";

const weapons = getWeaponPaths();

async function getStats(path: string): Weapon {
  const content = readFileSync(path).toString();
  const stats = content.toString().match(/SetDefaults\(\)[\w\W]*?}\n/gim);

  if (!stats) {
    throw new Error("Unable to find stats for " + path);
  }
  const weaponName = path.split("/").pop()?.split(".cs")[0];
  if (!weaponName) {
    throw new Error("Unable to get weapon name for " + path);
  }

  const defaults = getDefaults(content, weaponName);
  console.log(defaults);
}
let filtered = weapons.filter((weapon) => {
  return weapon.includes("Biome");
});

console.log(await getStats(filtered[0]));

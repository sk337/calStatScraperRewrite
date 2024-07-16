interface config {
  ignore: string[];
  force: string[];
}

const config: config = {
  ignore: ["RogueWeapon.cs", "Skynamite.cs"],
  force: [
    "./CalamityModPublic/Items/Tools/InfernaCutter.cs",
    "./CalamityModPublic/Items/Tools/Grax.cs",
    "./CalamityModPublic/Items/Fishing/BrimstoneCragCatches/DragoonDrizzlefish.cs",
  ],
};

export default config;

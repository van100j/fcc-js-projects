export const width = 74;
export const height = 30;

export const Walkers = [".", "░", "╬", "E", "B", "*", "▮", "Δ"];

export const Weapons = [
  "Stick",
  "Mace",
  "Long Sword",
  "Short Bow",
  "Arrow",
  "Dagger",
  "Two Handed Sword",
  "Dart",
  "Shuriken",
  "Spear"
];
export const Mappings = new Map()
    .set(".", "floor")
    .set("Δ", "portal")
    .set("E", "enemy")
    .set("B", "boss")
    .set("*", "health")
    .set("▮", "weapon")
    .set("═", "wall h")
    .set("║", "wall v")
    .set("╔", "corner tl")
    .set("╗", "corner tr")
    .set("╚", "corner bl")
    .set("╝", "corner br")
    .set("╬", "wall door")
    .set("░", "passage")
    .set("?", "black")
    .set("☺", "hero");

export const Symbols = new Map()
    .set("hero", "☺")
    .set("floor", ".")
    .set("enemy", "E")
    .set("boss", "B")
    .set("health", "*")
    .set("weapon", "▮")
    .set("wall-h", "═")
    .set("wall-v", "║")
    .set("corner-tl", "╔")
    .set("corner-tr", "╗")
    .set("corner-bl", "╚")
    .set("corner-br", "╝")
    .set("door", "╬")
    .set("portal", "Δ")
    .set("passage", "░");

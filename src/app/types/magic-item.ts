export enum Rarity {
  Common,
  Uncommon,
  Rare,
  Very_Rare,
  Legendary,
  Artifact,
}

export const RarityToFront: Record<Rarity, string> = {
  [Rarity.Common]: "Common",
  [Rarity.Uncommon]: "Uncommon",
  [Rarity.Rare]: "Rare",
  [Rarity.Very_Rare]: "Very Rare",
  [Rarity.Legendary]: "Legendary",
  [Rarity.Artifact]: "Artifact"
}

export const RarityToBack: Record<Rarity, string> = {
  [Rarity.Common]: "common",
  [Rarity.Uncommon]: "uncommon",
  [Rarity.Rare]: "rare",
  [Rarity.Very_Rare]: "very Rare",
  [Rarity.Legendary]: "legendary",
  [Rarity.Artifact]: "artifact"
}

export enum ItemType {
  Weapon,
  Trinket,
  Armour,
  Shield,
  Spellcasting_Focus,
}

export const ItemTypeToFront: Record<ItemType, string> = {
  [ItemType.Weapon]: "Weapon",
  [ItemType.Trinket]: "Trinket",
  [ItemType.Armour]: "Armour",
  [ItemType.Shield]: "Shield",
  [ItemType.Spellcasting_Focus]: "Spellcasting Focus",
}

export const ItemTypeToBack: Record<ItemType, string> = {
  [ItemType.Weapon]: "weapon",
  [ItemType.Trinket]: "trinket",
  [ItemType.Armour]: "armour",
  [ItemType.Shield]: "shield",
  [ItemType.Spellcasting_Focus]: "spellcasting focus",
}

export enum ItemPurpose {
  Offense,
  Defense,
  Utility,
  Healing,
  Support
}

export const ItemPurposeToFront: Record<ItemPurpose, string> = {
  [ItemPurpose.Offense]: "Offense",
  [ItemPurpose.Defense]: "Defense",
  [ItemPurpose.Utility]: "Utility",
  [ItemPurpose.Healing]: "Healing",
  [ItemPurpose.Support]: "Support",
}

export const ItemPurposeToBack: Record<ItemPurpose, string> = {
  [ItemPurpose.Offense]: "offense",
  [ItemPurpose.Defense]: "defense",
  [ItemPurpose.Utility]: "utility",
  [ItemPurpose.Healing]: "healing",
  [ItemPurpose.Support]: "support",
}

export const Weirdness: Record<number, string> = {
  1: "very straightforward",
  2: "somewhat straightforward",
  3: "slightly unconventional",
  4: "unconventional",
  5: "very unconventional"
}

export interface MagicItemInput {
  rarity: Rarity;
  uses: string;
  itemTypePreset: ItemType;
  itemTypeFreeText: string;
  itemPurposePreset: ItemPurpose;
  itemPurposeFreeText: string;
  cursed: boolean;
  curses: string;
  attunement: boolean;
  magicCreativity?: number; //NOTE bounded [1-5]
  curseCreativity?: number; //NOTE bounded [1-5]
  additionalDetail: string;
}

export interface MagicItemOutput {
  rarity: Rarity;
  description: string;
  itemType: string | ItemType;
  itemPurpose: string | ItemPurpose;
  abilitiesAndEffects: string;
}

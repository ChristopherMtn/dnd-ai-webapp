export enum Rarity {
  Common = "Common",
  Uncommon = "Uncommon",
  Rare = "Rare",
  Very_Rare = "Very Rare",
  Legendary = "Legendary",
  Artifact = "Artifact",
}

export enum PresetItemType {
  Weapon = "Weapon",
  Trinket = "Trinket",
  Armour = "Armour",
  Shield = "Shield",
  Spellcasting_Focus = "Spellcasting Focus",
}

export interface MagicItemInput {
  rarity: Rarity;
  uses: string;
  itemTypePreset: PresetItemType;
  itemTypeFreeText: string;
  curses: string;
  magicSpecification: string;
  statistics: JSON;
  attunement: boolean;
  magicCreativity?: number;
  curseCreativity?: number;
  additionalDetail: string;
}

export interface MagicItemOutput {
  rarity: Rarity;
  description: string;
  itemType: string | PresetItemType;
  stats: JSON;
  abilitiesAndEffects: string;
}

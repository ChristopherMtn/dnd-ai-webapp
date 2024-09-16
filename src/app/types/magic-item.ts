enum Rarity {
  Common,
  Uncommon,
  Rare,
  Very_Rare,
  Legendary,
  Artifact,
}

enum PresetItemType {
  Weapon,
  Trinket,
  Armour,
  Shield,
  Spellcasting_Focus,
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

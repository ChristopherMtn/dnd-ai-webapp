export enum CreatureCategory {
  Aberration,
  Beast,
  Celestial,
  Construct,
  Dragon,
  Elemental,
  Fey,
  Giant,
  Humanoid,
  Monstrosity,
  Ooze,
  Plant,
  Undead,
}

export enum CreatureSize {
  Tiny, //2.5ft^2
  Small, //5ft^2
  Medium, //5ft^2
  Large, //10ft^2
  Huge, //15ft^2
  Gargantuan, // 20ft^2 <=
}

export enum Skill {
  // str
  Athletics,
  // dex
  Acrobatics,
  Sleight_Of_Hand,
  Stealth,
  // int
  Arcana,
  History,
  Investigation,
  Nature,
  Religion,
  // wis
  Animal_Handling,
  Insight,
  Medicine,
  Perception,
  Survival,
  // cha
  Deception,
  Intimidation,
  Performance,
  Persuasion,
}

export enum CreatureLanguage {
  // standard
  Common,
  Dwarvish,
  Elvish,
  Giant,
  Gnomish,
  Goblin,
  Halfling,
  Orc,
  // exotic
  Abyssal,
  Celestial,
  Draconic,
  Kraul,
  Loxodon,
  Merfolk,
  Minotaur,
  Sphinx,
  Sylvan,
  Vedalken, //bruh even I haven't heard of some of these
  Deep_Speech,
  Infernal,
  Aquan,
  Auran,
  Ignan,
  Terran,
  Undercommon,
  Aarakocra,
  Druidic,
  Gith,
  Thieves_Cant,
  Telepathy,
}

export enum Sense {
  Blindsight,
  Darkvision,
  Tremorsense,
  Truesight,
}

export enum DamageTypes {
  Acid,
  Bludgeoning,
  Cold,
  Fire,
  Force,
  Lightning,
  Necrotic,
  Piercing,
  Poison,
  Pyschic,
  Radiant,
  Slashing,
  Thunder,
}

export enum AttackType {
  Melee,
  Ranged,
}

export enum Dice {
  D4,
  D6,
  D8,
  D10,
  D12,
  D20,
  D100,
}

type CreatureSpeeds = {
  //NOTE: all speeds are multiples of 5
  // if a creature has no speed of a certain type it should be 0
  // only non-zero speeds should be displayed
  speed: number; //refers to normal land speed
  climb: number;
  fly: number;
  swim: number;
  burrow: number;
};

type CreatureStats = {
  // bounded [1,30]
  str: number;
  dex: number;
  con: number;
  int: number;
  wis: number;
  cha: number;
};
export function getModifierFromStat(stat: number): number {
  return Math.floor((stat - 10) / 2);
}

type CreatureSkill = {
  // TODO: we need to decide how to handle skill modifiers. They're based on two things, the monster's proficiency bonus, and the relevant stat.
  // If we calculate them then this will always be the case. However, sometimes as a DM I find I like to break this rule and just choose the value to be whatever fits.
  // So we need to decide if these can be decoupled from proficiency bonus and stats, meaning the user could pick any number value, or if they just check a box to say the monster is proficient.
  // This can also get dicy as technically there are edge cases where you can be "double-proficient" in a skill.
  name: Skill;
  bonus: number; //bounded [(-20), 20]ish
};

type CreatureSense = {
  senseType: Sense;
  senseDistance: number; //value in feet. Always multiples of 5.
};

type CreatureAbility = {
  // Note: these can get complicated, best to the typing vague
  name: string;
  description: string;
};

type CreatureAction = {
  name: boolean;
  actionType: AttackType;
  range: number; //min 5ft, must be multiple of 5
  description: string; //could just assume the description is gonna be spot on and get rid of everything else
  bonusToHit: number;
  damageDiceNumberToRoll: number;
  damageDiceType: Dice;
  damageType: DamageTypes;
};

type CreatureSpellSlots = {
  numberOfCastsPerDay: number;
  spellLevel: number; //bounded [0-9]
};

type LegendaryAction = {
  // special class of action that boss monsters can take at the end of a creature's turn
  description: string; //usually refers to another action the monster has or lets them cast a spell or move a distance or something.
  cost: number; //creatures have fixed number of these around. Some cost multiple legendary actions to perform.
};

export interface Creature {
  name: string;
  description: string;
  category: CreatureCategory;
  size: CreatureSize;
  speeds: CreatureSpeeds;
  stats: CreatureStats;
  armorclass: number; //bounded [5,30]
  skills: [CreatureSkill];
  senses: [CreatureSense];
  vulnerabilities: [DamageTypes];
  resistances: [DamageTypes];
  Immunities: [DamageTypes];
  challengerating: number; //TODO typing on this is tough. Lowest possible is 1/8 but once it goes above 1 it's always just a round number
  languages: [CreatureLanguage];
  abilities: [CreatureAbility];
  spellslots: [CreatureSpellSlots];
  spellsknown: [string]; //I am not making an enumeration of all the spells
  reactions: [CreatureAbility];
  actions: [CreatureAction];
  legendaryactions: [LegendaryAction];
  // there's also such a thing as lair actions but those also start incorporating the environment so are complicated
}

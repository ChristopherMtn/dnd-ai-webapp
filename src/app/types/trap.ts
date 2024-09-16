enum DangerLevel {
  Deterrent,
  Harmful,
  Lethal,
}

export interface TrapInput {
  magicOrMechanic: boolean;
  dangerLevel: DangerLevel;
  environment: string;
  CharacterLevel: number;
  additionalDetail: string;
}

export interface TrapOutput {
  description: JSON;
  trigger: JSON;
  countermeasures: JSON;
  effect: JSON;
}

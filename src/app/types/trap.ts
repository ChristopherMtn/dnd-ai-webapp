export enum DangerLevel {
  Deterrent = "Deterrent",
  Harmful = "Harmful",
  Lethal = "Lethal",
}

export interface TrapInput {
  magic: boolean;
  dangerLevel: DangerLevel;
  environment: string;
  CharacterLevel: number;
  additionalDetail: string;
}

export interface TrapOutput {
  description: string;
  trigger: string;
  countermeasures: string;
  effect: string;
}

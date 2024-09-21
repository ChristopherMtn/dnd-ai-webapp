export enum DangerLevel {
  Deterrent = "Deter",
  Harmful = "Harm",
  Lethal = "Kill",
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

export enum DangerLevel {
  Deterrent = "Deterrent",
  Harmful = "Harmful",
  Lethal = "Lethal",
}

export const DangerLevelToBack: Record<DangerLevel, string> = {
  [DangerLevel.Deterrent]: "deter but not harm",
  [DangerLevel.Harmful]: "harm but not kill",
  [DangerLevel.Lethal]: "potentially kill",
};

export const DangerLevelToFront: Record<DangerLevel, string> = {
  [DangerLevel.Deterrent]: "Deterrent",
  [DangerLevel.Harmful]: "Harmful",
  [DangerLevel.Lethal]: "Lethal",
};

export interface TrapInput {
  magic: boolean;
  dangerLevel: DangerLevel;
  environment: string;
  CharacterLevel: number;
  additionalDetail: string;
}

export interface TrapOutput {
  name: string;
  description: string;
  trigger: string;
  countermeasures: string;
  effect: string;
}

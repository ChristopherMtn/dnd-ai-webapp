import { Creature } from "./creature";

export interface NPCInput extends Creature {
    // NOTE: could modify some of these. Should probably all be free text but could also have some enums for stock jobs, wealth brackets and classes.
    job: string;
    wealth: string;
    race: string;
    class: string;
    details: string;
};

export interface NPCOutput extends Creature {
    appearance: string; //may have some overlap with the description field on creature
    behaviour: string; //how they act/speak etc
    backstory: string;
};
import { TrapOutput } from "../types";

export const trapImageDims = {
  width: 1024,
  height: 1024,
};

function generateJsonFormat<T>(template: { [K in keyof T]: string }): string {
  return JSON.stringify(template, null, 2);
}

const trapOutputExample: TrapOutput = {
  description:
    "A shimmering magical barrier blocks a narrow stone hallway. The barrier glows faintly with runes that pulse in rhythmic patterns, enticing the party to approach.",
  trigger:
    "When a creature touches the barrier or attempts to pass through it, the runes activate, unleashing a burst of searing light and a concussive force.",
  countermeasures:
    "Disabling the trap requires dispelling the magic or carefully scraping away key runes without disturbing the others. Detecting the runes' activation mechanism can be done with an Arcana check (DC 15). Alternatively, casting 'Dispel Magic' at level 3 or higher deactivates the barrier.",
  effect:
    "Upon activation, the trap deals 3d6 radiant damage and 2d6 thunder damage to all creatures within 15 feet of the barrier. Additionally, creatures in this area must make a DC 14 Dexterity saving throw or be knocked prone.",
};

const json_format = generateJsonFormat(trapOutputExample);

export const trapPromptTemplate = {
  system_prompt: `You are an AI specialized in Dungeons and Dragons, who is very creative at generating interesting and engaging traps. You ensure the description of the trap is simple and visual so that it can be passed to an AI model to generate an image. Return a JSON object without adding Markdown formatting (such as backticks or \`\`\`json). Only provide valid raw JSON code.`,
  prompt_template: [
    "Create a {magic} trap for D&D 5e that is appropriate for a party of level {CharacterLevel} characters.",
    "The trap should be designed to {danger} players.",
    "Environment: {environment}",
    "Additional Detail: {additionalDetail}",
    "Example output: {json_format}",
  ],
  json_format,
};

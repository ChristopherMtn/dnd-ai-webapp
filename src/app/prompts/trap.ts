import { TrapInput, TrapOutput, DangerLevelToBack } from "../types";
import { formatPrompt, TextPromptOutput } from "../utils/formatPrompt";

export const trapImageDims = {
  width: 1024,
  height: 1024,
};

function generateJsonFormat<T>(template: T): string {
  return JSON.stringify(template, null, 2);
}

const trapOutputExample: TrapOutput = {
  name: "Barrier of Light",
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
  less_dangerous_system_prompt: `You are an AI specialized in Dungeons and Dragons. Given text providing the description, trigger, countermeasures, and effects of a trap, create a slightly less dangerous verison of the same trap. Return a JSON object without adding Markdown formatting (such as backticks or \`\`\`json). Only provide valid raw JSON code.`,
  more_dangerous_system_prompt: `You are an AI specialized in Dungeons and Dragons. Given text providing the description, trigger, countermeasures, and effects of a trap, create a slightly more dangerous verison of the same trap. Return a JSON object without adding Markdown formatting (such as backticks or \`\`\`json). Only provide valid raw JSON code.`,
  danger_prompt_template: [
    "Name: {name}",
    "Description: {description}",
    "Trigger: {trigger}",
    "Countermeasures: {countermeasures}",
    "Effect: {effect}",
    "Example Output: {json_format}",
  ],
};

export const imagePromptTemplate =
  "In a Dungeons and Dragons art style: {imageDescription}";

export function generateTrapTextPrompts(
  trapInput: TrapInput
): TextPromptOutput {
  const { magic, dangerLevel, environment, CharacterLevel, additionalDetail } =
    trapInput;

  // Convert the 'magic' boolean to 'magical' or 'non-magical'
  const magicString = magic ? "magical" : "non-magical";

  // Convert 'dangerLevel' enum to string using the mapping
  const dangerString = DangerLevelToBack[dangerLevel];

  // Prepare the data object for placeholder replacement
  const data: Record<string, string> = {
    magic: magicString,
    danger: dangerString,
    environment: environment || "any",
    CharacterLevel: CharacterLevel.toString(),
    additionalDetail: additionalDetail || "None",
    json_format: trapPromptTemplate.json_format,
  };

  // Use the formatPrompt function to replace placeholders
  const userPrompt = formatPrompt(trapPromptTemplate.prompt_template, data);
  const systemPrompt = trapPromptTemplate.system_prompt;
  return { systemPrompt, userPrompt };
}

export function generateTrapLessDangerousTextPrompts(
  trapLessInput: TrapOutput
): TextPromptOutput {
  const { description, trigger, countermeasures, effect } = trapLessInput;

  const data: Record<string, string> = {
    description: description,
    trigger: trigger,
    countermeasures: countermeasures,
    effect: effect,
    json_format: trapPromptTemplate.json_format,
  };

  const userPrompt = formatPrompt(
    trapPromptTemplate.danger_prompt_template,
    data
  );
  const systemPrompt = trapPromptTemplate.less_dangerous_system_prompt;
  return { systemPrompt, userPrompt };
}

export function generateTrapMoreDangerousTextPrompts(
  trapMoreInput: TrapOutput
): TextPromptOutput {
  const { description, trigger, countermeasures, effect } = trapMoreInput;

  const data: Record<string, string> = {
    description: description,
    trigger: trigger,
    countermeasures: countermeasures,
    effect: effect,
    json_format: trapPromptTemplate.json_format,
  };

  const userPrompt = formatPrompt(
    trapPromptTemplate.danger_prompt_template,
    data
  );
  const systemPrompt = trapPromptTemplate.more_dangerous_system_prompt;
  return { systemPrompt, userPrompt };
}

export function generateTrapImagePrompt(imageDescription: string): string {
  return formatPrompt([imagePromptTemplate], { imageDescription });
}

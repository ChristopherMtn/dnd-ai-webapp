import {
  MagicItemInput,
  MagicItemOutput,
  Rarity,
  RarityToBack,
  ItemTypeToBack,
  ItemPurposeToBack,
  RarityToFront,
} from "../types/magic-item";
import { formatPrompt, TextPromptOutput } from "../utils/formatPrompt";

export const magicItemImageDims = {
  width: 1024,
  height: 1024,
};

function generateJsonFormat<T>(template: T): string {
  return JSON.stringify(template, null, 2);
}

const magicItemOutputExample: MagicItemOutput = {
  rarity: RarityToFront[Rarity.Rare], // "rare"
  description:
    "A finely crafted longsword with an intricate hilt that glows with a faint blue light.",
  itemType: "Weapon",
  itemPurpose: "Offense",
  abilitiesAndEffects:
    "Deals an extra 1d6 cold damage on a successful hit. Grants the wielder resistance to fire damage.",
};

const json_format = generateJsonFormat(magicItemOutputExample);

export const magicItemPromptTemplate = {
  system_prompt: `You are an AI specialized in Dungeons and Dragons, who is very creative at generating interesting and engaging magic items. Ensure the description is simple and visual so it can be passed to an AI model to generate an image. Return a JSON object without Markdown formatting. Only provide valid raw JSON code.`,
  prompt_template: [
    "Create a {rarity} magic item for D&D 5e.",
    "Item Type: {itemType}",
    "Item Purpose: {itemPurpose}",
    "Cursed: {cursed}",
    "{cursesSection}",
    "Attunement Required: {attunement}",
    "Uses: {uses}",
    "Magic Unconventionality (1 is lowest, 5 is highest): {magicCreativity}",
    "{curseCreativitySection}",
    "Additional Detail: {additionalDetail}",
    "Example output: {json_format}",
  ],
  json_format,
  less_powerful_system_prompt: `You are an AI specialized in Dungeons and Dragons. Given text providing the rarity, description, item type, item purpose, and abilities/effects of a magic item, create a slightly less powerful verison of the same item. Return a JSON object without Markdown formatting. Only provide valid raw JSON code.`,
  more_powerful_system_prompt: `You are an AI specialized in Dungeons and Dragons. Given text providing the rarity, description, item type, item purpose, and abilities/effects of a magic item, create a slightly more powerful verison of the same item. Return a JSON object without Markdown formatting. Only provide valid raw JSON code.`,
  power_prompt_template: [
    "Rarity: {rarity}",
    "Description: {description}",
    "Item Type: {itemType}",
    "Item Purpose: {itemPurpose}",
    "Abilities/Effects: {abilitiesAndEffects}",
    "Example output: {json_format}",
  ],
};

export const imagePromptTemplate =
  "In a Dungeons and Dragons art style: {imageDescription}";

export function generateMagicItemTextPrompts(
  magicItemInput: MagicItemInput
): TextPromptOutput {
  // Prepare the data object for placeholder replacement
  const data: Record<string, string> = {
    rarity: RarityToBack[magicItemInput.rarity],
    itemType:
      typeof magicItemInput.itemType === "string"
        ? magicItemInput.itemType
        : ItemTypeToBack[magicItemInput.itemType],
    itemPurpose:
      typeof magicItemInput.itemPurpose === "string"
        ? magicItemInput.itemPurpose
        : ItemPurposeToBack[magicItemInput.itemPurpose],
    cursed: magicItemInput.cursed ? "Yes" : "No",
    attunement: magicItemInput.attunement ? "Yes" : "No",
    uses: magicItemInput.uses || "N/A",
    magicCreativity: magicItemInput.magicCreativity?.toString() || "3",
    curseCreativity: magicItemInput.curseCreativity?.toString() || "3",
    additionalDetail: magicItemInput.additionalDetail || "None",
    json_format: magicItemPromptTemplate.json_format,
  };

  // Handle the cursesSection
  if (magicItemInput.cursed && magicItemInput.curses) {
    data["cursesSection"] = `Curses: ${magicItemInput.curses}`;
    data[
      "curseCreativity"
    ] = `Curse Unconventionality (1 is lowest, 5 is highest): ${
      magicItemInput.curseCreativity?.toString() || "3"
    }`;
  } else {
    data["cursesSection"] = "";
    data["curseCreativity"] = "";
  }

  // Use the formatPrompt function to replace placeholders
  const userPrompt = formatPrompt(
    magicItemPromptTemplate.prompt_template,
    data
  );

  const systemPrompt = magicItemPromptTemplate.system_prompt;
  return { systemPrompt, userPrompt };
}

export function generateMagicItemLessPowerfulTextPrompts(
  magicItemLessInput: MagicItemOutput
) {
  const { rarity, description, itemType, itemPurpose, abilitiesAndEffects } =
    magicItemLessInput;
  const data: Record<string, string> = {
    rarity: rarity,
    description: description,
    itemType: itemType,
    itemPurpose: itemPurpose,
    abilitiesAndEffects: abilitiesAndEffects,
    json_format: magicItemPromptTemplate.json_format,
  };

  const userPrompt = formatPrompt(
    magicItemPromptTemplate.power_prompt_template,
    data
  );
  const systemPrompt = magicItemPromptTemplate.less_powerful_system_prompt;
  return { systemPrompt, userPrompt };
}

export function generateMagicItemMorePowerfulTextPrompts(
  magicItemMoreInput: MagicItemOutput
) {
  const { rarity, description, itemType, itemPurpose, abilitiesAndEffects } =
    magicItemMoreInput;
  const data: Record<string, string> = {
    rarity: rarity,
    description: description,
    itemType: itemType,
    itemPurpose: itemPurpose,
    abilitiesAndEffects: abilitiesAndEffects,
    json_format: magicItemPromptTemplate.json_format,
  };

  const userPrompt = formatPrompt(
    magicItemPromptTemplate.power_prompt_template,
    data
  );
  const systemPrompt = magicItemPromptTemplate.more_powerful_system_prompt;
  return { systemPrompt, userPrompt };
}

export function generateMagicItemImagePrompt(imageDescription: string): string {
  return formatPrompt([imagePromptTemplate], { imageDescription });
}

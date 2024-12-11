import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { TextModelManager } from "../models/textModelConfig";

export async function generateText(
  systemPrompt: string,
  userPrompt: string,
  textModelConfig: TextModelManager,
  temperature: number = 1.0
): Promise<string> {
  try {
    const model = textModelConfig.instantiateModel(temperature);

    const messages = [
      new SystemMessage(systemPrompt),
      new HumanMessage(userPrompt),
    ];

    const result = await model.invoke(messages);

    return result.content as string;
  } catch (error) {
    console.error("Error generating text:", error);
    throw new Error("Failed to generate text. Please try again.");
  }
}

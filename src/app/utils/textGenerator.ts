import { openai } from "./openaiClient";
import { ChatCompletionMessageParam } from "openai/resources/index.mjs";

export async function generateText(
  systemPrompt: string,
  userPrompt: string,
  model: string = (process.env.TEXT_GENERATION_MODEL as string) ||
    "gpt-4o-mini",
  temperature: number = 1.0
): Promise<string> {
  console.log(`model: ${model}`);
  const messages: ChatCompletionMessageParam[] = [
    { role: "system", content: systemPrompt },
    { role: "user", content: userPrompt },
  ];

  const response = await openai.chat.completions.create({
    model,
    messages,
    temperature,
  });

  const content = response.choices[0].message?.content;

  if (!content) {
    throw new Error("No content returned from OpenAI");
  }

  return content;
}

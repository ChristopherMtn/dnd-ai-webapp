import { ChatOpenAI } from "@langchain/openai";
import { ChatAnthropic } from "@langchain/anthropic";
import { BaseChatModel } from "@langchain/core/language_models/chat_models";

export type TextModelType = "OpenAI" | "Anthropic";

export class TextModelManager {
  private currentModelType: TextModelType;
  private temperature: number;

  constructor() {
    this.currentModelType =
      (process.env.DEFAULT_TEXT_MODEL as TextModelType) || "OpenAI";
    this.temperature = 1.0;
  }

  get modelType(): TextModelType {
    return this.currentModelType;
  }

  set modelType(modelType: TextModelType) {
    if (!modelType) {
      throw new Error("Invalid model type.");
    }
    this.currentModelType = modelType;
  }

  get modelTemperature(): number {
    return this.temperature;
  }

  set modelTemperature(temperature: number) {
    this.temperature = temperature;
  }

  instantiateModel(temperature: number): BaseChatModel {
    switch (this.currentModelType) {
      case "OpenAI":
        return new ChatOpenAI({
          model:
            (process.env.OPENAI_TEXT_GENERATION_MODEL as string) ||
            "gpt-4o-mini",
          temperature: temperature || this.temperature,
          apiKey: process.env.OPENAI_API_KEY,
        });
      case "Anthropic":
        return new ChatAnthropic({
          temperature: temperature || this.temperature,
          apiKey: process.env.ANTHROPIC_API_KEY,
        });
      default:
        throw new Error(`Unsupported model type: ${this.currentModelType}`);
    }
  }
}

export const textModelConfig = new TextModelManager();

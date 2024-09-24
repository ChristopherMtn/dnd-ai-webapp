import { NextRequest, NextResponse } from "next/server";
import { TrapInput, DangerLevel } from "@/app/types";
import OpenAI from "openai";
import { trapPromptTemplate } from "@/app/prompt_templates/trap";
import { ChatCompletionMessageParam } from "openai/resources/index.mjs";

const configuration = { apiKey: process.env.OPENAI_API_KEY };
const openai = new OpenAI(configuration);

function createDangerDescription(dangerLevel: DangerLevel): string {
  switch (dangerLevel) {
    case DangerLevel.Deterrent:
      return "deter but not harm";
    case DangerLevel.Harmful:
      return "harm but not kill";
    case DangerLevel.Lethal:
      return "potentially kill";
    default:
      return "";
  }
}

function formatPrompt(
  templateLines: string[],
  data: Record<string, string>
): string {
  return templateLines
    .map((line) => {
      let formattedLine = line;
      for (const key in data) {
        const regex = new RegExp(`{${key}}`, "g");
        formattedLine = formattedLine.replace(regex, data[key]);
      }
      return formattedLine;
    })
    .filter((line) => line.trim() !== "")
    .join("\n");
}

export async function POST(request: NextRequest) {
  try {
    const { trapInput } = (await request.json()) as { trapInput: TrapInput };

    if (!trapInput) {
      return NextResponse.json(
        { error: "Trap input is required" },
        { status: 400 }
      );
    }

    const { system_prompt, prompt_template, json_format } = trapPromptTemplate;

    // Build the prompt data
    const magic = trapInput.magic ? "magical" : "non-magical";
    const danger = createDangerDescription(trapInput.dangerLevel);
    const environment =
      trapInput.environment.trim() !== ""
        ? `Information about where the trap is: ${trapInput.environment}`
        : "";
    const additionalDetail =
      trapInput.additionalDetail.trim() !== ""
        ? `Additional details: ${trapInput.additionalDetail}`
        : "";

    const promptVariables = {
      magic,
      CharacterLevel: trapInput.CharacterLevel.toString(),
      danger,
      environment,
      additionalDetail,
      json_format,
    };

    const userPrompt: string = formatPrompt(prompt_template, promptVariables);

    const messages: ChatCompletionMessageParam[] = [
      {
        role: "system",
        content: system_prompt,
      },
      {
        role: "user",
        content: userPrompt,
      },
    ];

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: messages,
    });

    const description = response.choices[0].message?.content || "";

    return NextResponse.json({ description }, { status: 200 });
  } catch (error) {
    console.error("OpenAI API Error:", error);
    return NextResponse.json(
      { error: "An error occurred while generating the response" },
      { status: 500 }
    );
  }
}

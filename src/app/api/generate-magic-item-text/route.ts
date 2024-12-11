import { NextRequest, NextResponse } from "next/server";
import { GenerateMagicItemTextRequest, MagicItemOutput } from "@/app/types";
import { generateText } from "@/app/utils/textGenerator";
import { handleApiError } from "@/app/utils/errorHandler";
import { generateMagicItemTextPrompts } from "@/app/prompts/magic-item";
import { textModelConfig } from "@/app/models/textModelConfig";

export async function POST(request: NextRequest) {
  try {
    const { magicItemInput } =
      (await request.json()) as GenerateMagicItemTextRequest;

    if (!magicItemInput) {
      return NextResponse.json(
        { error: "Magic Item input is required" },
        { status: 400 }
      );
    }

    const { systemPrompt, userPrompt } =
      generateMagicItemTextPrompts(magicItemInput);

    const responseContent = await generateText(
      systemPrompt,
      userPrompt,
      textModelConfig
    );

    // Parse the OpenAI response into a MagicItemOutput object
    let magicItemOutput: MagicItemOutput;
    try {
      magicItemOutput = JSON.parse(responseContent);
    } catch (err) {
      return handleApiError(err, "Invalid response from OpenAI");
    }

    return NextResponse.json({ magicItemOutput }, { status: 200 });
  } catch (error) {
    return handleApiError(
      error,
      "An error occurred while generating the response"
    );
  }
}

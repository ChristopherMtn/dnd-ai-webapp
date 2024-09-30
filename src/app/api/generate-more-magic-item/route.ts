import { NextRequest, NextResponse } from "next/server";
import { MagicItemOutput } from "@/app/types";
import { generateText } from "@/app/utils/textGenerator";
import { handleApiError } from "@/app/utils/errorHandler";
import { generateMagicItemMorePowerfulTextPrompts } from "@/app/prompts/magic-item";

export async function POST(request: NextRequest) {
  try {
    const magicItemMoreInput = (await request.json()) as MagicItemOutput;

    if (!magicItemMoreInput) {
      return NextResponse.json(
        { error: "Magic Item input is required" },
        { status: 400 }
      );
    }

    const { systemPrompt, userPrompt } =
      generateMagicItemMorePowerfulTextPrompts(magicItemMoreInput);

    const responseContent = await generateText(
      systemPrompt,
      userPrompt,
      undefined,
      0
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

import { NextRequest, NextResponse } from "next/server";
import { TrapOutput } from "@/app/types";
import { generateTrapLessDangerousTextPrompts } from "@/app/prompts/trap";
import { generateText } from "@/app/utils/textGenerator";
import { handleApiError } from "@/app/utils/errorHandler";
import { textModelConfig } from "@/app/models/textModelConfig";

export async function POST(request: NextRequest) {
  try {
    const trapLessInput = (await request.json()) as TrapOutput;

    if (!trapLessInput) {
      return NextResponse.json(
        { error: "Trap input is required" },
        { status: 400 }
      );
    }

    const { systemPrompt, userPrompt } =
      generateTrapLessDangerousTextPrompts(trapLessInput);

    const responseContent = await generateText(
      systemPrompt,
      userPrompt,
      textModelConfig,
      0
    );

    // Parse the OpenAI response into a TrapOutput object
    let trapOutput: TrapOutput;
    try {
      trapOutput = JSON.parse(responseContent);
    } catch (err) {
      return handleApiError(err, "Invalid response from OpenAI");
    }

    return NextResponse.json({ trapOutput }, { status: 200 });
  } catch (error) {
    return handleApiError(
      error,
      "An error occurred while generating the response"
    );
  }
}

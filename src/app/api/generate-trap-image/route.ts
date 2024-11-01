import { NextRequest, NextResponse } from "next/server";
import { GenerateTrapImageRequest } from "@/app/types";
import { generateTrapImagePrompt, trapImageDims } from "@/app/prompts/trap";
import { generateImage } from "@/app/utils/imageGenerator";
import { handleApiError } from "@/app/utils/errorHandler";

export async function POST(request: NextRequest) {
  try {
    const { imageDescription } =
      (await request.json()) as GenerateTrapImageRequest;

    if (!imageDescription) {
      return NextResponse.json(
        { error: "Image description is required" },
        { status: 400 }
      );
    }

    const prompt = generateTrapImagePrompt(imageDescription);
    const size = `${trapImageDims.width}x${trapImageDims.height}`;

    const imageUrls = await generateImage(prompt, size);

    return NextResponse.json({ imageUrls }, { status: 200 });
  } catch (error) {
    return handleApiError(
      error,
      "An error occurred while generating the images"
    );
  }
}

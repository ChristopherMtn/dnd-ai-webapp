import { NextRequest, NextResponse } from "next/server";
import { GenerateMagicItemImageRequest } from "@/app/types";
import { generateImage } from "@/app/utils/imageGenerator";
import { handleApiError } from "@/app/utils/errorHandler";
import {
  generateMagicItemImagePrompt,
  magicItemImageDims,
} from "@/app/prompts/magic-item";

export async function POST(request: NextRequest) {
  try {
    const { imageDescription } =
      (await request.json()) as GenerateMagicItemImageRequest;

    if (!imageDescription) {
      return NextResponse.json(
        { error: "Image description is required" },
        { status: 400 }
      );
    }

    const prompt = generateMagicItemImagePrompt(imageDescription);
    const size = `${magicItemImageDims.width}x${magicItemImageDims.height}`;

    const imageUrls = await generateImage(prompt, size);

    return NextResponse.json({ imageUrls }, { status: 200 });
  } catch (error) {
    return handleApiError(
      error,
      "An error occurred while generating the images"
    );
  }
}

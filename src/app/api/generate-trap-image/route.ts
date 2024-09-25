import { NextRequest, NextResponse } from "next/server";
import { GenerateTrapImageRequest } from "@/app/types";
import OpenAI from "openai";
import { trapImageDims } from "@/app/prompt_templates/trap";
import { ImageGenerateParams } from "openai/resources/images.mjs";

const configuration = { apiKey: process.env.OPENAI_API_KEY };
const openai = new OpenAI(configuration);

export async function POST(request: NextRequest) {
  try {
    const { imageDescription } =
      (await request.json()) as GenerateTrapImageRequest;

    console.log("Received imageDescription:", imageDescription);

    if (!imageDescription) {
      return NextResponse.json(
        { error: "Image description is required" },
        { status: 400 }
      );
    }

    const response = await openai.images.generate({
      prompt: `In a dungeons and dragons art style: ${imageDescription}`,
      n: 1,
      size: `${trapImageDims.width}x${trapImageDims.height}` as ImageGenerateParams["size"],
      model: "dall-e-3",
    });

    // Collect all image URLs
    const imageUrls = response.data.map((item) => item.url);

    return NextResponse.json({ imageUrls }, { status: 200 });
  } catch (error) {
    console.error("OpenAI API Error:", error);
    return NextResponse.json(
      { error: "An error occurred while generating the images" },
      { status: 500 }
    );
  }
}

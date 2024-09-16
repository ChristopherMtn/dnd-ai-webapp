import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const configuration = { apiKey: process.env.OPENAI_API_KEY };
const openai = new OpenAI(configuration);

export async function POST(request: NextRequest) {
  try {
    const { imageDescription } = await request.json();

    console.log("Received imageDescription:", imageDescription);

    if (!imageDescription) {
      return NextResponse.json(
        { error: "Image description is required" },
        { status: 400 }
      );
    }

    const response = await openai.images.generate({
      prompt: `A picture of the trap in Dungeons and Dragons style: ${imageDescription}`,
      n: 1,
      size: "1024x1024",
      model: "dall-e-3",
    });

    const imageUrl = response.data[0].url;

    return NextResponse.json({ imageUrl }, { status: 200 });
  } catch (error) {
    console.error("OpenAI API Error:", error);
    return NextResponse.json(
      { error: "An error occurred while generating the response" },
      { status: 500 }
    );
  }
}

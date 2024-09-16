import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const configuration = { apiKey: process.env.OPENAI_API_KEY };
const openai = new OpenAI(configuration);

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    const response = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "You are an AI specialized in Dungeons and Dragons, who is very creative at generating traps.",
        },
        { role: "user", content: `${prompt}` },
      ],
      model: "gpt-4o-mini",
    });

    const result = response.choices[0].message.content;

    return NextResponse.json({ result }, { status: 200 });
  } catch (error) {
    console.error("OpenAI API Error:", error);
    return NextResponse.json(
      { error: "An error occurred while generating the response" },
      { status: 500 }
    );
  }
}

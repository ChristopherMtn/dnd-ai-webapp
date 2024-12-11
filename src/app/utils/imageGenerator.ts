import { openai } from "./openaiClient";
import { ImageGenerateParams } from "openai/resources/images.mjs";

export async function generateImage(
  prompt: string,
  size: string,
  n: number = 1,
  model: string = (process.env.OPENAI_IMAGE_GENERATION_MODEL as string) ||
    "dall-e-2"
): Promise<string[]> {
  const response = await openai.images.generate({
    prompt,
    n,
    size: size as ImageGenerateParams["size"],
    model,
  });

  const imageUrls = response.data
    .map((item) => item.url)
    .filter((url): url is string => url !== undefined);

  if (!imageUrls.length || !imageUrls[0]) {
    throw new Error("No images returned from OpenAI");
  }

  return imageUrls;
}

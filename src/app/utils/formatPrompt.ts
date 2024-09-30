export interface TextPromptOutput {
  systemPrompt: string;
  userPrompt: string;
}

export function formatPrompt(
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
      return formattedLine.trim();
    })
    .filter((line) => line !== "")
    .join("\n");
}

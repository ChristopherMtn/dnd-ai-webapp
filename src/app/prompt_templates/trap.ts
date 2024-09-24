export const trapPromptTemplate = {
  system_prompt:
    "You are an AI specialized in Dungeons and Dragons, who is very creative at generating traps.",
  prompt_template: [
    "Create a {magic} trap for D&D 5e that is appropriate for a party of level {CharacterLevel} characters.",
    "The trap should be designed to {danger} players.",
    "{environment}",
    "{additionalDetail}",
    "Respond with a simple, un-nested JSON object in the following format: {json_format}",
  ],
  json_format:
    '{"description":"example text", "trigger":"example text", "countermeasures":"example text", "effect":"example text"}',
};

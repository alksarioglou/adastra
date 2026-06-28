import OpenAI from "openai";

let client: OpenAI | null = null;

export function openai(): OpenAI {
  if (!client) {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY is not set");
    }
    client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return client;
}

export const OPENAI_MODEL = process.env.OPENAI_MODEL ?? "gpt-4o";

/** Call the model and parse a JSON object from its reply. */
export async function generateJson<T>(
  system: string,
  user: string,
): Promise<T> {
  const res = await openai().chat.completions.create({
    model: OPENAI_MODEL,
    temperature: 0.4,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: system },
      { role: "user", content: user },
    ],
  });
  const content = res.choices[0]?.message?.content ?? "{}";
  return JSON.parse(content) as T;
}

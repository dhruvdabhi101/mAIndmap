import { OpenAI } from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

export type Node = {
  id: string;
  content: string;
  explanation: string;
  level: number;
  parentId: string | null;
  mindMapId: string;
};

type SubtopicResponse = {
  title: string;
  explanation: string;
  importance?: string;
};

export async function POST(req: Request) {
  try {
    const { mainTopic, nodePath, currentNode } = await req.json();

    const pathString = nodePath.map((node: Node) => node.content).join(" > ");

    const prompt = `
      Generate a detailed explanation about "${currentNode.content}" in the context of ${mainTopic}.
      Path to current topic: ${pathString}
      The explanation should:
      1. Define the concept clearly
      2. Explain its importance in the broader topic
      3. Provide 1-2 examples if applicable
      4. Be around 150-200 words
    `;

    const completion = await openai.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: "You are a helpful AI that generates educational content.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const explanation =
      completion.choices[0].message.content ||
      "Failed to generate explanation.";

    return NextResponse.json({ explanation });
  } catch (error) {
    console.error("Error in explain route:", error);
    return NextResponse.json(
      { error: "Failed to generate explanation" },
      { status: 500 }
    );
  }
}

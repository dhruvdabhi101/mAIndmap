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

// /app/api/mindmap/expand/route.ts
export async function POST(req: Request) {
  try {
    const { mainTopic, nodePath, currentNode } = await req.json();

    const pathString = nodePath.map((node: Node) => node.content).join(" > ");

    const prompt = `
      Generate 4 detailed subtopics for "${currentNode.content}" in the context of ${mainTopic}.
      Path to current topic: ${pathString}
      For each subtopic provide:
      1. A concise title (max 5 words)
      2. A brief explanation (2-3 sentences)
      3. A short note on why this subtopic is important
      Format the response as a JSON array of objects with properties: "title", "explanation", "importance"
      Make sure the output is valid JSON.
    `;

    const completion = await openai.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful AI that generates structured educational content. Always respond with valid JSON.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      response_format: { type: "json_object" },
    });

    const content = completion.choices[0].message.content;
    if (!content) throw new Error("No content returned from AI");

    const subtopics: { subtopics: SubtopicResponse[] } = JSON.parse(content);

    // Convert to Node objects
    const nodes: Node[] = subtopics.subtopics.map((subtopic, index) => ({
      id: `node-${Date.now()}-${index}`,
      content: subtopic.title,
      explanation: `${subtopic.explanation} ${subtopic.importance}`,
      level: currentNode.level + 1,
      parentId: currentNode.id,
      mindMapId: currentNode.mindMapId,
    }));

    return NextResponse.json({ nodes });
  } catch (error) {
    console.error("Error in expand route:", error);
    return NextResponse.json(
      { error: "Failed to expand node" },
      { status: 500 }
    );
  }
}

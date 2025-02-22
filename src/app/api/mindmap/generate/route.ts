import { OpenAI } from "openai";
import { groq } from "@ai-sdk/groq";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";

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

export async function POST(req: NextRequest) {
  try {
    // Get the user's token from the request
    const session = await getServerSession();

    const { topic } = await req.json();

    const prompt = `
      Generate 5 essential subtopics for learning about "${topic}".
      For each subtopic provide:
      1. A concise title (max 5 words)
      2. A brief explanation (2-3 sentences)
      Format the response as a JSON array of objects with properties: "title", "explanation"
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

    // Create a new MindMap in the database
    const mindMap = await prisma.mindMap.create({
      data: {
        title: topic,
        userId: session?.user.id as string,
      },
    });
    const parentNode = await prisma.node.create({
      data: {
        content: topic,
        explanation: "This is the main topic",
        level: 0,
        parentId: null,
        mindMapId: mindMap.id,
      },
    });

    // Create nodes in the database
    const dbNodes = await Promise.all(
      subtopics.subtopics.map((subtopic) =>
        prisma.node.create({
          data: {
            content: subtopic.title,
            explanation: subtopic.explanation,
            level: 1,
            parentId: parentNode.id,
            mindMapId: mindMap.id,
          },
        })
      )
    );

    // Convert to Node objects for the frontend
    const nodes: Node[] = dbNodes.map((node) => ({
      id: node.id,
      content: node.content,
      explanation: node.explanation,
      level: node.level,
      parentId: node.parentId,
      mindMapId: node.mindMapId,
    }));

    return NextResponse.json({ nodes, mindMapId: mindMap.id });
  } catch (error) {
    console.error("Error in generate route:", error);
    return NextResponse.json(
      { error: "Failed to generate mind map nodes" },
      { status: 500 }
    );
  }
}

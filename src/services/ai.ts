import { groq } from "@ai-sdk/groq";
import { Node } from "@prisma/client";
import { generateText } from "ai";

type SubtopicResponse = {
  title: string;
  explanation: string;
  importance: string;
};

export class AIService {
  private static model = groq("llama3-70b-8192");

  /**
   * Generates initial subtopics for a main topic
   */
  static async generateInitialSubtopics(topic: string): Promise<Node[]> {
    const prompt = `
      Generate 5 essential subtopics for learning about "${topic}".

      For each subtopic provide:
      1. A concise title (max 5 words)
      2. A brief explanation (2-3 sentences)

      Format as JSON array of objects with properties: "title", "explanation"
    `;

    try {
      const response = await generateText({ model: this.model, prompt });

      const content = response.text;
      if (!content) throw new Error("No content returned from AI");

      const subtopics: SubtopicResponse[] = JSON.parse(content);

      // Convert to Node objects
      return subtopics.map((subtopic, index) => ({
        id: `temp-${index}`, // Will be replaced when saving to DB
        content: subtopic.title,
        explanation: subtopic.explanation,
        level: 1,
        parentId: null,
        mindMapId: "", // Will be set when saving
      }));
    } catch (error) {
      console.error("Error generating subtopics:", error);
      throw error;
    }
  }

  /**
   * Expands a specific node with more detailed subtopics
   */
  static async expandNode(
    mainTopic: string,
    nodePath: Node[],
    currentNode: Node
  ): Promise<Node[]> {
    const pathString = nodePath.map((node) => node.content).join(" > ");

    const prompt = `
      Generate 4 detailed subtopics for "${currentNode.content}" in the context of ${mainTopic}.

      Path to current topic: ${pathString}

      For each subtopic provide:
      1. A concise title (max 5 words)
      2. A brief explanation (2-3 sentences)
      3. A short note on why this subtopic is important for understanding "${currentNode.content}"

      Format as JSON array of objects with properties: "title", "explanation", "importance"
    `;

    try {
      const response = await generateText({ model: this.model, prompt });

      const content = response.text;
      if (!content) throw new Error("No content returned from AI");

      const subtopics: SubtopicResponse[] = JSON.parse(content);

      // Convert to Node objects
      return subtopics.map((subtopic, index) => ({
        id: `temp-${index}`, // Will be replaced when saving to DB
        content: subtopic.title,
        explanation: `${subtopic.explanation} ${subtopic.importance}`,
        level: currentNode.level + 1,
        parentId: currentNode.id,
        mindMapId: currentNode.mindMapId,
      }));
    } catch (error) {
      console.error("Error expanding node:", error);
      throw error;
    }
  }

  /**
   * Generate a detailed explanation for a specific node
   */
  static async generateDetailedExplanation(
    mainTopic: string,
    nodePath: Node[],
    currentNode: Node
  ): Promise<string> {
    const pathString = nodePath.map((node) => node.content).join(" > ");

    const prompt = `
      Generate a detailed explanation about "${currentNode.content}" in the context of ${mainTopic}.

      Path to current topic: ${pathString}

      The explanation should:
      1. Define the concept clearly
      2. Explain its importance in the broader topic
      3. Provide 1-2 examples if applicable
      4. Be around 150-200 words
    `;

    try {
      const response = await generateText({ model: this.model, prompt });
      return response.text || "Failed to generate detailed explanation.";
    } catch (error) {
      console.error("Error generating explanation:", error);
      return "An error occurred while generating the explanation.";
    }
  }
}

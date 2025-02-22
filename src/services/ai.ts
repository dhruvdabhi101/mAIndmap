// /services/MindMapService.ts
// import { Node } from '../types/node';

export class MindMapService {
  /**
   * Generates initial subtopics for a main topic
   */
  static async generateInitialSubtopics(topic: string): Promise<Node[]> {
    try {
      const response = await fetch("/api/mindmap/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ topic }),
      });

      if (!response.ok) throw new Error("Failed to generate subtopics");

      const data = await response.json();
      return data.nodes;
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
    try {
      const response = await fetch("/api/mindmap/expand", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ mainTopic, nodePath, currentNode }),
      });

      if (!response.ok) throw new Error("Failed to expand node");

      const data = await response.json();
      return data.nodes;
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
    try {
      const response = await fetch("/api/mindmap/explain", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ mainTopic, nodePath, currentNode }),
      });

      if (!response.ok) throw new Error("Failed to generate explanation");

      const data = await response.json();
      return data.explanation;
    } catch (error) {
      console.error("Error generating explanation:", error);
      throw error;
    }
  }
}

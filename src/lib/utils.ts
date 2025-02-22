//@ts-nocheck
import { clsx, type ClassValue } from "clsx";
import { Edge, MarkerType, Node } from "reactflow";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function calculateNodePosition(
  index: number,
  total: number,
  centerX: number,
  centerY: number,
  radius: number
) {
  const angle = (2 * Math.PI * index) / total - Math.PI / 2; // Start from top (-Math.PI/2)
  return {
    x: centerX + radius * Math.cos(angle),
    y: centerY + radius * Math.sin(angle),
  };
}

export function calculateSubNodePosition(
  parentX: number,
  parentY: number,
  index: number,
  total: number,
  radius: number,
  spreadAngle = Math.PI // 180 degrees spread
) {
  // Calculate the starting angle (to center the spread)
  const startAngle = -spreadAngle / 2;
  // Calculate angle for this node
  const angle = startAngle + (spreadAngle * (index + 1)) / (total + 1);

  return {
    x: parentX + radius * Math.cos(angle),
    y: parentY + radius * Math.sin(angle),
  };
}

export function calculateEdgeStyle(sourceNode: Node, targetNode: Node) {
  const dx = targetNode.position.x - sourceNode.position.x;
  const dy = targetNode.position.y - sourceNode.position.y;
  const distance = Math.sqrt(dx * dx + dy * dy);

  // Calculate control points for a bezier curve
  const controlPointDistance = distance * 0.4;
  const midPoint = {
    x: (sourceNode.position.x + targetNode.position.x) / 2,
    y: (sourceNode.position.y + targetNode.position.y) / 2,
  };

  return {
    type: "smoothstep",
    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: 20,
      height: 20,
    },
    style: {
      strokeWidth: 2,
      stroke: "#666", // Default color
    },
    // Add these for animated edges
    animated: true,
    animationDuration: "800ms",
  };
}

export function calculateEdges(
  nodes: Node[],
  parentNode: Node | null = null
): Edge[] {
  const edges: Edge[] = [];

  if (!parentNode) {
    // Find the center node
    const centerNode = nodes.find((node) => node.id === "center");
    if (!centerNode) return edges;

    // Create edges from center to first-level nodes
    const firstLevelNodes = nodes.filter(
      (node) =>
        node.id !== "center" && (!node.data.level || node.data.level === 1)
    );

    firstLevelNodes.forEach((node) => {
      edges.push({
        id: `center-${node.id}`,
        source: centerNode.id,
        target: node.id,
        ...calculateEdgeStyle(centerNode, node),
      });
    });
  } else {
    // Find child nodes for this parent
    const childNodes = nodes.filter(
      (node) => node.data.parentId === parentNode.id
    );

    childNodes.forEach((node) => {
      edges.push({
        id: `${parentNode.id}-${node.id}`,
        source: parentNode.id,
        target: node.id,
        ...calculateEdgeStyle(parentNode, node),
      });
    });
  }

  return edges;
}

// Helper function to create edges between nodes
export const createEdgesFromNodes = (nodes: any): Edge[] => {
  console.log("nodes", nodes);
  const edges: Edge[] = [];
  const centerNode = nodes.find((node) => node.level === 0);

  if (!centerNode) return edges;

  // Create edges for first level nodes (connected to center)
  const firstLevelNodes = nodes.filter((node) => node.level === 1);
  firstLevelNodes.forEach((node) => {
    edges.push({
      id: `${centerNode.id}-${node.id}`,
      source: centerNode.id,
      target: node.id,
      // type: "smoothstep",
      animated: true,
    });
  });

  // Create edges for higher level nodes
  const higherLevelNodes = nodes.filter((node) => node.level > 1);
  higherLevelNodes.forEach((node) => {
    if (node.parentId) {
      edges.push({
        id: `${node.parentId}-${node.id}`,
        source: node.parentId,
        target: node.id,
        // type: "smoothstep",
        animated: true,
      });
    }
  });
  console.log("edges", edges);

  return edges;
};

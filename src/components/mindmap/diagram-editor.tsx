"use client";

import * as React from "react";
import { Bot, Plus, MessageSquare, Loader2 } from "lucide-react";
import ReactFlow, {
  Background,
  Controls,
  Node,
  Edge,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  MarkerType,
  Position,
  Handle,
} from "reactflow";
import "reactflow/dist/style.css";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { NavUser } from "./nav-user";
import { calculateNodePosition, createEdgesFromNodes } from "@/lib/utils";

// Custom Node Types
const nodeTypes = {
  mindMapNode: MindMapNode,
};
const defaultEdgeOptions = {
  type: "smoothstep",
  markerEnd: {
    type: MarkerType.ArrowClosed,
  },
  style: {
    strokeWidth: 2,
  },
};

// MindMap Node Component
function MindMapNode({ data, id }: { data: any; id: string }) {
  const [showExplanation, setShowExplanation] = React.useState(false);

  return (
    <>
      <Handle
        type={data.level === 0 ? "source" : "target"}
        position={Position.Top}
      />
      <div
        className="rounded-lg border bg-card p-4 shadow-sm cursor-pointer hover:bg-accent"
        onClick={() => setShowExplanation(true)}
      >
        <div className="text-sm font-medium">{data.label}</div>
        {data.canExpand && (
          <Button
            size="sm"
            variant="ghost"
            className="mt-2"
            onClick={(e) => {
              e.stopPropagation();
              data.onExpand();
            }}
          >
            Expand
          </Button>
        )}
      </div>

      <Dialog open={showExplanation} onOpenChange={setShowExplanation}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{data.label}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="prose dark:prose-invert">{data.explanation}</div>
          </div>
          <DialogClose asChild>
            <Button className="mt-4">Close</Button>
          </DialogClose>
        </DialogContent>
      </Dialog>
      <Handle type="source" position={Position.Bottom} />
    </>
  );
}

// Types
interface DiagramChat {
  id: string;
  title: string;
  createdAt: Date;
  nodes: Node[];
  edges: Edge[];
  mainTopic?: string;
}

interface MindMapNode extends Node {
  explanation?: string;
  canExpand?: boolean;
}

export default function DiagramWorkspace() {
  const [diagrams, setDiagrams] = React.useState<DiagramChat[]>([]);
  const [selectedDiagram, setSelectedDiagram] =
    React.useState<DiagramChat | null>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [loading, setLoading] = React.useState(false);
  const [newTopicDialog, setNewTopicDialog] = React.useState(false);
  const [newTopic, setNewTopic] = React.useState("");

  const { data: session, status } = useSession();

  const onConnect = React.useCallback(
    (params: Connection | Edge) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );
  React.useEffect(() => {
    if (status === "authenticated") {
      setLoading(false);
      console.log("User is authenticated:", session);
    } else if (status === "unauthenticated") {
      setLoading(false);
      redirect("/login");
    } else {
      setLoading(true);
      console.log("Loading...");
    }
  }, [status]);

  // Fetch user's mindmaps on component mount
  React.useEffect(() => {
    const fetchMindMaps = async () => {
      try {
        const response = await fetch("/api/mindmap/user-mindmaps");
        if (!response.ok) throw new Error("Failed to fetch mindmaps");

        const data = await response.json();
        const formattedDiagrams: DiagramChat[] = data.mindMaps.map(
          (mindMap: any) => ({
            id: mindMap.id,
            title: mindMap.title,
            createdAt: new Date(mindMap.createdAt),
            nodes: mindMap.nodes.map((node: any, idx: number) => ({
              id: node.id,
              type: "mindMapNode",
              position:
                node.level === 0
                  ? { x: 0, y: 0 }
                  : calculateNodePosition(
                      idx,
                      mindMap.nodes.length - 1,
                      0,
                      0,
                      200
                    ), // You'll need to store/calculate positions
              data: {
                label: node.content,
                explanation: node.explanation,
                canExpand: node.level === 0 ? false : true,
                parentId: node.parentId,
                onExpand: () => expandNode(mindMap.title, [], node),
              },
            })),
            edges: createEdgesFromNodes(mindMap.nodes), // You'll need to calculate edges based on parent-child relationships
            mainTopic: mindMap.title,
          })
        );

        setDiagrams(formattedDiagrams);
      } catch (error) {
        console.error("Error fetching mindmaps:", error);
      }
    };

    if (status === "authenticated") {
      fetchMindMaps();
    } else if (status === "unauthenticated") {
      redirect("/login");
    }
  }, [status]);

  const generateMindMap = async (topic: string) => {
    setLoading(true);
    try {
      const response = await fetch("/api/mindmap/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ topic }),
      });

      const data = await response.json();
      console.log(data);

      // Create center node for main topic
      const centerNode: Node = {
        id: "center",
        type: "mindMapNode",
        position: { x: 0, y: 0 },
        data: {
          label: topic,
          explanation: "Main topic",
        },
      };

      // Position child nodes in a circle around the center
      const childNodes: Node[] = data.nodes.map((node: any, index: number) => {
        const angle = (2 * Math.PI * index) / data.nodes.length;
        const radius = 300;
        return {
          id: node.id,
          type: "mindMapNode",
          position: {
            x: radius * Math.cos(angle),
            y: radius * Math.sin(angle),
          },
          data: {
            label: node.content,
            explanation: node.explanation,
            canExpand: true,
            onExpand: () => expandNode(topic, [centerNode], node),
          },
        };
      });

      // Create edges from center to child nodes
      const newEdges: Edge[] = childNodes.map((node) => ({
        id: `center-${node.id}`,
        source: "center",
        target: node.id,
      }));

      const newDiagram: DiagramChat = {
        id: `diagram-${Date.now()}`,
        title: topic,
        createdAt: new Date(),
        nodes: [centerNode, ...childNodes],
        edges: newEdges,
        mainTopic: topic,
      };

      setDiagrams([newDiagram, ...diagrams]);
      setSelectedDiagram(newDiagram);
      setNodes([centerNode, ...childNodes]);
      setEdges(newEdges);
      setNewTopicDialog(false);
      setNewTopic("");
    } catch (error) {
      console.error("Error generating mind map:", error);
    } finally {
      setLoading(false);
    }
  };

  // Expand a node with subtopics
  const expandNode = async (
    mainTopic: string,
    nodePath: Node[],
    currentNode: Node
  ) => {
    setLoading(true);
    try {
      const response = await fetch("/api/mindmap/expand", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ mainTopic, nodePath, currentNode }),
      });

      const data = await response.json();

      // Position new nodes in a semicircle below the parent node
      const parentNode = nodes.find((n) => n.id === currentNode.id)!;
      console.log(parentNode);
      const newNodes: Node[] = data.nodes.map((node: any, index: number) => {
        const angle = (Math.PI * (index + 1)) / (data.nodes.length + 1);
        const radius = 200;
        return {
          id: node.id,
          type: "mindMapNode",
          position: {
            x: parentNode.position.x + radius * Math.cos(angle),
            y: parentNode.position.y + radius * Math.sin(angle),
          },
          data: {
            label: node.content,
            explanation: node.explanation,
            canExpand: true,
            onExpand: () =>
              expandNode(mainTopic, [...nodePath, parentNode], node),
          },
        };
      });

      // Create edges from parent to new nodes
      const newEdges: Edge[] = newNodes.map((node) => ({
        id: `${currentNode.id}-${node.id}`,
        source: currentNode.id,
        target: node.id,
      }));

      setNodes([...nodes, ...newNodes]);
      setEdges([...edges, ...newEdges]);

      // Update the current diagram
      if (selectedDiagram) {
        const updatedDiagram = {
          ...selectedDiagram,
          nodes: [...nodes, ...newNodes],
          edges: [...edges, ...newEdges],
        };
        setDiagrams(
          diagrams.map((d) =>
            d.id === selectedDiagram.id ? updatedDiagram : d
          )
        );
        setSelectedDiagram(updatedDiagram);
      }
    } catch (error) {
      console.error("Error expanding node:", error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (selectedDiagram) {
      setNodes(selectedDiagram.nodes);
      setEdges(selectedDiagram.edges);
    }
  }, [selectedDiagram]);

  return (
    <div className="flex h-screen w-full dark:bg-background">
      <SidebarProvider>
        <Sidebar className="w-[300px] border-r flex">
          <SidebarHeader>
            <Dialog open={newTopicDialog} onOpenChange={setNewTopicDialog}>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-2 px-2"
                >
                  <Plus className="h-4 w-4" />
                  New Mind Map
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Mind Map</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Input
                      placeholder="Enter your topic..."
                      value={newTopic}
                      onChange={(e) => setNewTopic(e.target.value)}
                    />
                  </div>
                  <Button
                    onClick={() => generateMindMap(newTopic)}
                    disabled={!newTopic || loading}
                    className="w-full"
                  >
                    {loading && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Generate Mind Map
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </SidebarHeader>
          <SidebarContent>
            <ScrollArea className="h-[calc(100vh-4rem)]">
              <SidebarMenu className="flex flex-col">
                {diagrams.map((diagram) => (
                  <SidebarMenuItem key={diagram.id}>
                    <SidebarMenuButton
                      isActive={selectedDiagram?.id === diagram.id}
                      onClick={() => setSelectedDiagram(diagram)}
                      className="w-full hover:bg-gray-300 h-full rounded-lg"
                    >
                      <div className="flex w-full flex-col">
                        <div className="flex items-center gap-2 text-primary">
                          <MessageSquare className="h-4 w-6" />
                          <span className="font-medium">{diagram.title}</span>
                        </div>
                      </div>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </ScrollArea>
          </SidebarContent>
          <SidebarFooter>
            <NavUser
              user={{ email: session?.user.email!, name: session?.user.name! }}
            />
          </SidebarFooter>
          <SidebarRail />
        </Sidebar>

        <main className="flex-1">
          <div className="flex h-16 items-center gap-4 border-b px-4">
            <SidebarTrigger />
            {selectedDiagram && (
              <div className="flex items-center gap-2">
                <Bot className="h-5 w-5" />
                <span className="font-semibold">{selectedDiagram.title}</span>
              </div>
            )}
          </div>

          <div className="h-[calc(100vh-4rem)] w-full">
            {loading && (
              <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/10">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            )}
            {selectedDiagram ? (
              <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                nodeTypes={nodeTypes}
                fitView
              >
                <Background />
                <Controls />
              </ReactFlow>
            ) : (
              <div className="flex h-full items-center justify-center">
                <div className="text-center">
                  <h2 className="text-lg font-semibold">
                    Welcome to Mind Map Generator
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Enter a topic to generate a mind map or select an existing
                    one from the sidebar
                  </p>
                </div>
              </div>
            )}
          </div>
        </main>
      </SidebarProvider>
    </div>
  );
}

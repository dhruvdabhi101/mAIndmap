"use client";

import * as React from "react";
import { Bot, Plus, MessageSquare } from "lucide-react";
import ReactFlow, {
  Background,
  Controls,
  Node,
  Edge,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
} from "reactflow";
import "reactflow/dist/style.css";

import { Button } from "@/components/ui/button";
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
import { formatDistanceToNow } from "date-fns";
import { NavUser } from "./nav-user";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

// Type for a diagram chat
interface DiagramChat {
  id: string;
  title: string;
  createdAt: Date;
  nodes: Node[];
  edges: Edge[];
}

// Sample diagram data
const initialDiagrams: DiagramChat[] = [
  {
    id: "1",
    title: "System Architecture",
    createdAt: new Date("2024-02-20"),
    nodes: [
      {
        id: "1",
        type: "default",
        data: { label: "Frontend" },
        position: { x: 100, y: 100 },
      },
      {
        id: "2",
        type: "default",
        data: { label: "Backend" },
        position: { x: 300, y: 100 },
      },
    ],
    edges: [
      {
        id: "e1-2",
        source: "1",
        target: "2",
      },
    ],
  },
  {
    id: "2",
    title: "Database Schema",
    createdAt: new Date("2024-02-21"),
    nodes: [
      {
        id: "1",
        type: "default",
        data: { label: "Users" },
        position: { x: 100, y: 100 },
      },
      {
        id: "2",
        type: "default",
        data: { label: "Posts" },
        position: { x: 300, y: 100 },
      },
    ],
    edges: [
      {
        id: "e1-2",
        source: "1",
        target: "2",
      },
    ],
  },
];

export default function DiagramWorkspace() {
  const [diagrams, setDiagrams] =
    React.useState<DiagramChat[]>(initialDiagrams);
  const [selectedDiagram, setSelectedDiagram] =
    React.useState<DiagramChat | null>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [loading, setLoading] = React.useState(false)

  const onConnect = React.useCallback(
    (params: Connection | Edge) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );
  const { data: session, status } = useSession();

  React.useEffect(() => {
    if (status === "unauthenticated") {
      redirect("/login");
    } else if (status === "loading") {
      setLoading(true);
    } else {
      setLoading(false);
    }
  }, [status])

  // console.log(session, status)
  // Create new diagram
  const createNewDiagram = () => {
    const newDiagram: DiagramChat = {
      id: `diagram-${diagrams.length + 1}`,
      title: `New Diagram ${diagrams.length + 1}`,
      createdAt: new Date(),
      nodes: [],
      edges: [],
    };
    setDiagrams([newDiagram, ...diagrams]);
    setSelectedDiagram(newDiagram);
    setNodes([]);
    setEdges([]);
  };

  // Load diagram when selected
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
            <Button
              variant="ghost"
              className="w-full justify-start gap-2 px-2"
              onClick={createNewDiagram}
            >
              <Plus className="h-4 w-4" />
              New Diagram
            </Button>
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
                          <MessageSquare className="h-4 w-6 " />
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
            <NavUser user={{ email: session?.user.email!, name: session?.user.name! }} />
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
            {selectedDiagram ? (
              <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                fitView
              >
                <Background />
                <Controls />
              </ReactFlow>
            ) : (
              <div className="flex h-full items-center justify-center">
                <div className="text-center">
                  <h2 className="text-lg font-semibold">
                    Welcome to Diagram Chat
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Select a diagram from the sidebar or create a new one to get
                    started
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

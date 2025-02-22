import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    // Get the user's session
    const session = await getServerSession();
    console.log("Session:", session);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch all mindmaps for the user
    const mindMaps = await prisma.mindMap.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        nodes: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ mindMaps });
  } catch (error) {
    console.error("Error fetching mindmaps:", error);
    return NextResponse.json(
      { error: "Failed to fetch mindmaps" },
      { status: 500 }
    );
  }
}

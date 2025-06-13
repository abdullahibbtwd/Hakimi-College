import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import { NextResponse } from "next/server";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function POST(req: Request) {
  try {
    const { userId } = await req.json();

    // Get the user's role from Convex
    const role = await convex.query(api.users.getUserRole, {
      clerkUserId: userId,
    });

    return NextResponse.json({ role });
  } catch (error) {
    console.error("Error getting user role:", error);
    return NextResponse.json(
      { error: "Failed to get user role" },
      { status: 500 }
    );
  }
} 
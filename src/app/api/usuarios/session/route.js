import { NextResponse } from "next/server";
import { getUserFromToken } from "@/app/lib/auth";

export async function GET() {
  try {
    const user = await getUserFromToken();
    if (!user) {
      return NextResponse.json({ message: "No authenticated user" }, { status: 401 });
    }
    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error("Error fetching user session:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
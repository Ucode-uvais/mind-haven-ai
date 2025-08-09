// app/api/chat/sessions/[sessionId]/history/route.ts
import { NextRequest, NextResponse } from "next/server";

const BACKEND_API_URL = process.env.BACKEND_API_URL || "http://localhost:3001";

export async function GET(
  req: NextRequest,
  { params }: { params: { sessionId: string } }
) {
  try {
    const { sessionId } = params;

    const authHeader = req.headers.get("authorization") || "";

    const response = await fetch(
      `${BACKEND_API_URL}/chat/sessions/${encodeURIComponent(
        sessionId
      )}/history`,
      {
        method: "GET",
        headers: {
          "content-type": "application/json",
          authorization: authHeader,
        },
        // If calling an external origin during build or in Edge, you may need:
        // cache: "no-store",
        // next: { revalidate: 0 },
      }
    );

    if (!response.ok) {
      // Try to read error body safely
      let message = "Failed to fetch chat history";
      try {
        const err = await response.json();
        if (err?.message) message = err.message;
      } catch {
        // ignore JSON parse errors
      }
      return NextResponse.json({ error: message }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error("Error in history route:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

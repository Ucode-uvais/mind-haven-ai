// app/api/chat/sessions/[sessionId]/route.ts
import { NextRequest, NextResponse } from "next/server";

const API_BASE =
  process.env.NODE_ENV === "production" ? "" : "http://localhost:3001";

type ParamsPromise = Promise<{ sessionId: string }>;

export async function GET(
  req: NextRequest,
  { params }: { params: ParamsPromise }
) {
  try {
    const { sessionId } = await params;

    const response = await fetch(`${API_BASE}/chat/sessions/${sessionId}`);
    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(error, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: ParamsPromise }
) {
  try {
    const { sessionId } = await params;

    const response = await fetch(`${API_BASE}/chat/sessions/${sessionId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(error, { status: response.status });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

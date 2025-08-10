import { NextRequest, NextResponse } from "next/server";

interface RouteParams {
  params: {
    sessionId: string;
  };
}

const BACKEND_API_URL = process.env.BACKEND_API_URL || "http://localhost:3001";

export async function GET(req: NextRequest, context: RouteParams) {
  try {
    const { sessionId } = context.params;

    const response = await fetch(
      `${BACKEND_API_URL}/chat/sessions/${sessionId}`
    );
    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(error, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest, context: RouteParams) {
  try {
    const { sessionId } = context.params;

    const response = await fetch(
      `${BACKEND_API_URL}/chat/sessions/${sessionId}`,
      {
        method: "DELETE",
      }
    );

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(error, { status: response.status });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

//history/route.ts

import { NextRequest, NextResponse } from "next/server";

const BACKEND_API_URL = process.env.BACKEND_API_URL || "http://localhost:3001";

export const GET = async (
  req: NextRequest,
  context: { params: { sessionId: string } } // Corrected function signature
) => {
  try {
    const { sessionId } = context.params; // Destructure params here
    console.log(`Getting chat history for session ${sessionId}`);

    const authHeader = req.headers.get("Authorization");

    const response = await fetch(
      `${BACKEND_API_URL}/chat/sessions/${sessionId}/history`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: authHeader || "",
        },
      }
    );

    if (!response.ok) {
      const error = await response.json();
      console.error("Failed to get chat history:", error);
      return NextResponse.json(
        { error: error.error || "Failed to get chat history" },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log("Chat history retrieved successfully:", data);

    // It's a good practice to ensure data is an array before mapping
    if (!Array.isArray(data)) {
      return NextResponse.json({ messages: [] });
    }

    // Type definition for a single message
    interface ChatMessage {
      role: string;
      content: string;
      timestamp: string;
    }

    const formattedMessages = data.map((msg: ChatMessage) => ({
      role: msg.role,
      content: msg.content,
      timestamp: msg.timestamp,
    }));

    return NextResponse.json(formattedMessages);
  } catch (error) {
    console.error("Error getting chat history:", error);
    return NextResponse.json(
      { error: "Failed to get chat history" },
      { status: 500 }
    );
  }
};

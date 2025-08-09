// In app/api/activities/route.ts

import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.BACKEND_API_URL || "http://localhost:3001";

export async function GET(req: NextRequest) {
  const token = req.headers.get("Authorization");

  try {
    const backendResponse = await fetch(`${API_URL}/api/activity`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token || "",
      },
    });

    const data = await backendResponse.json();
    if (!backendResponse.ok) {
      return NextResponse.json(data, { status: backendResponse.status });
    }
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const token = req.headers.get("Authorization");
  const body = await req.json();

  try {
    const backendResponse = await fetch(`${API_URL}/api/activity`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token || "",
      },
      body: JSON.stringify(body),
    });

    const data = await backendResponse.json();
    if (!backendResponse.ok) {
      return NextResponse.json(data, { status: backendResponse.status });
    }
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

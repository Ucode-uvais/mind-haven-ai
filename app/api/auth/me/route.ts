// me/route.ts

import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const API_BASE =
    process.env.NODE_ENV === "production" ? "" : "http://localhost:3001";
  const token = req.headers.get("Authorization");

  if (!token) {
    return NextResponse.json({ message: "No token provided" }, { status: 401 });
  }

  try {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: {
        Authorization: token,
      },
    });

    if (!res.ok) {
      return NextResponse.json(
        { message: "Failed to fetch user data" },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { message: "Server error", error },
      { status: 500 }
    );
  }
}

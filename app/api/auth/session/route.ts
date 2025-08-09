// session/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    // 1. Get the session token from the request cookies
    const sessionToken = req.cookies.get("session")?.value;

    // If no token is found, the user is not authenticated
    if (!sessionToken) {
      return NextResponse.json({ isAuthenticated: false });
    }

    // 2. Validate the token by calling the backend's /auth/me endpoint
    // This endpoint is protected and will only succeed with a valid token.
    const meResponse = await fetch(`${process.env.BACKEND_API_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${sessionToken}`,
      },
    });

    // 3. If the token is invalid, the backend will return an error (e.g., 401)
    if (!meResponse.ok) {
      // Clear the invalid cookie if you want, or just return unauthenticated
      console.error("Session validation failed:", meResponse.statusText);
      return NextResponse.json({ isAuthenticated: false });
    }

    // 4. If the token is valid, return the user data from the backend
    const user = await meResponse.json();
    return NextResponse.json({
      isAuthenticated: true,
      user: user,
    });
  } catch (error) {
    console.error("Error getting auth session:", error);
    return NextResponse.json(
      { isAuthenticated: false, error: "Failed to get auth session" },
      { status: 500 }
    );
  }
}

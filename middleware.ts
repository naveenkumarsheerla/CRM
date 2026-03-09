import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "./lib/auth";

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // 1. Handle CORS Preflight requests
    if (request.method === "OPTIONS") {
        return new NextResponse(null, {
            status: 204,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, POST, PATCH, DELETE, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type, Authorization",
            },
        });
    }

    // 2. Define public routes that don't require authentication
    if (
        pathname === "/api/auth/login" || 
        !pathname.startsWith("/api")
    ) {
        const response = NextResponse.next();
        response.headers.set("Access-Control-Allow-Origin", "*");
        return response;
    }

    // 3. Get the token from the Authorization header
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.startsWith("Bearer ") 
        ? authHeader.substring(7) 
        : null;

    if (!token) {
        return NextResponse.json(
            { error: "Unauthorized: No token provided" },
            { 
                status: 401,
                headers: { "Access-Control-Allow-Origin": "*" }
            }
        );
    }

    // 4. Verify the token
    const payload = await verifyToken(token);

    if (!payload) {
        return NextResponse.json(
            { error: "Unauthorized: Invalid or expired token" },
            { 
                status: 401,
                headers: { "Access-Control-Allow-Origin": "*" }
            }
        );
    }

    // 5. Token is valid, proceed with the request
    const response = NextResponse.next();
    response.headers.set("Access-Control-Allow-Origin", "*");
    return response;
}

// See "Matching Paths" below to learn more
export const config = {
    matcher: ["/api/:path*"],
};

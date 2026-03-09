import { NextResponse } from "next/server";
import { loginAction } from "@/app/login/actions";

export async function POST(request: Request) {
    try {
        const { email, password } = await request.json();

        if (!email || !password) {
            return NextResponse.json(
                { error: "Email and password are required" },
                { status: 400 }
            );
        }

        const result = await loginAction(email, password);

        if (!result.success) {
            return NextResponse.json(
                { error: result.error },
                { status: 401 }
            );
        }

        if (!result.user) {
            return NextResponse.json(
                { error: "Internal Server Error: User data missing" },
                { status: 500 }
            );
        }

        const { signToken } = await import("@/lib/auth");
        const token = await signToken({
            userId: result.user.id,
            email: result.user.email,
            role: result.user.role
        });

        return NextResponse.json({
            success: true,
            user: result.user,
            token
        });
    } catch (error) {
        console.error("Login API Error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}

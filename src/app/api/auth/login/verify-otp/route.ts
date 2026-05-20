import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://shellafood.com";

function getBackendMessage(data: any, fallback: string) {
  return data?.message || data?.errors?.[0]?.message || fallback;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.phone || !body.otp) {
      return NextResponse.json(
        {
          success: false,
          message: "Phone and OTP are required",
        },
        { status: 400 }
      );
    }

    const backendRes = await fetch(`${API_URL}/api/v1/auth/verify-login-otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "X-localization": body.lang || "en",
      },
      body: JSON.stringify({
        phone: body.phone,
        otp: body.otp,
        guest_id: body.guest_id || "",
      }),
    });

    const data = await backendRes.json().catch(() => ({}));

    if (!backendRes.ok) {
      return NextResponse.json(
        {
          success: false,
          message: getBackendMessage(data, "OTP verification failed"),
        },
        { status: backendRes.status }
      );
    }

    const token = data?.token;

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: "Authentication token was not returned after OTP verification",
        },
        { status: 502 }
      );
    }

    const response = NextResponse.json({
      success: true,
      message: "OTP verified successfully",
      data: {
        user: data.user || null,
        cart_transferred: data.cart_transferred ?? false,
        items_transferred: data.items_transferred ?? 0,
      },
    });

    response.cookies.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: body.remember ? 60 * 60 * 24 * 30 : 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    console.error("[Login Verify OTP API] Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}
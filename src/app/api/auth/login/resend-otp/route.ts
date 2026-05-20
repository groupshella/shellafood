import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://shellafood.com";

function getBackendMessage(data: any, fallback: string) {
  return data?.message || data?.errors?.[0]?.message || fallback;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.phone) {
      return NextResponse.json(
        {
          success: false,
          message: "Phone is required",
        },
        { status: 400 }
      );
    }

    const backendRes = await fetch(`${API_URL}/api/v1/auth/send-otp-again`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "X-localization": body.lang || "en",
      },
      body: JSON.stringify({
        phone: body.phone,
      }),
    });

    const data = await backendRes.json().catch(() => ({}));

    if (!backendRes.ok) {
      return NextResponse.json(
        {
          success: false,
          message: getBackendMessage(data, "Failed to resend OTP"),
          retry_after_seconds: data?.retry_after_seconds ?? null,
        },
        { status: backendRes.status }
      );
    }

    return NextResponse.json({
      success: true,
      message: getBackendMessage(data, "OTP sent successfully"),
      data: {
        otp_sent: data?.otp_sent ?? true,
        retry_after_seconds: data?.retry_after_seconds ?? null,
      },
    });
  } catch (error) {
    console.error("[Login Resend OTP API] Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}
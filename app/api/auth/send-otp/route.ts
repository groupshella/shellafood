import { NextRequest } from "next/server";
import { SendOtpRequest, SendOtpResponse } from "@/features/auth/types/auth.types";
import { apiError, apiSuccess } from "@/shared/lib/api-response";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;

export async function POST(request: NextRequest) {
  try {
    const body: SendOtpRequest = await request.json();

    if (!body.phone) {
      return apiError("Phone is required", 422);
    }

    const backendRes = await fetch(`${BACKEND_URL}/api/v2/auth/send-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ phone: body.phone.trim() }),
    });

    const data: SendOtpResponse = await backendRes.json();

    if (!backendRes.ok) {
      return apiError("Failed to send OTP", backendRes.status);
    }
    return apiSuccess<SendOtpResponse>(data, backendRes.status);
  } catch (error) {
    return apiError("Failed to send OTP", 500);
  }
}
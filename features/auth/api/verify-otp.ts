import { NextRequest } from "next/server";
import { VerifyOtpRequest, VerifyOtpResponse } from "@/features/auth/types/auth.types";
import { apiError, apiSuccess } from "@/shared/lib/api-response";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;

export async function postVerifyOtp(request: NextRequest) {
  try {
    const body: VerifyOtpRequest = await request.json();

    if (!body.phone.trim() || !body.otp.trim()) {
      return apiError("Phone and OTP are required", 422);
    }

    const backendRes = await fetch(`${BACKEND_URL}/api/v2/auth/verify-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        phone: body.phone.trim(),
        otp: body.otp.trim(),
      }),
    });
    const data: VerifyOtpResponse = await backendRes.json();
    if (!backendRes.ok) {
      return apiError("Failed to verify OTP", backendRes.status);
    }
    return apiSuccess<VerifyOtpResponse>(data, backendRes.status);
  } catch {
    return apiError("Failed to verify OTP", 500);
  }
}

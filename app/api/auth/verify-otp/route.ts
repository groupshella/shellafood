import { NextRequest } from "next/server";
import { postVerifyOtp } from "@/features/auth/api/verify-otp";

export async function POST(request: NextRequest) {
  return postVerifyOtp(request);
}

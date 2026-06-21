import { NextRequest } from "next/server";
import { postSendOtp } from "@/features/auth/api/send-otp";

export async function POST(request: NextRequest) {
  return postSendOtp(request);
}

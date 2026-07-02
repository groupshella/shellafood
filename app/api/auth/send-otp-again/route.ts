import { NextRequest } from "next/server";
import { postSendOtpAgain } from "@/features/auth/api/send-otp-again";

export async function POST(request: NextRequest) {
	return postSendOtpAgain(request);
}

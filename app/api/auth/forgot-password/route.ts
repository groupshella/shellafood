import { NextRequest } from "next/server";
import { postForgotPassword } from "@/features/auth/api/forgot-password";

export async function POST(request: NextRequest) {
	return postForgotPassword(request);
}

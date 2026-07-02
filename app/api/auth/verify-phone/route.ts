import { NextRequest } from "next/server";
import { postVerifyPhone } from "@/features/auth/api/verify-phone";

export async function POST(request: NextRequest) {
	return postVerifyPhone(request);
}

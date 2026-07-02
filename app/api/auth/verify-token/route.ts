import { NextRequest } from "next/server";
import { postVerifyToken } from "@/features/auth/api/verify-token";

export async function POST(request: NextRequest) {
	return postVerifyToken(request);
}

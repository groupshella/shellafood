import { NextRequest } from "next/server";
import { postLogin } from "@/features/auth/api/login";

export async function POST(request: NextRequest) {
	return postLogin(request);
}

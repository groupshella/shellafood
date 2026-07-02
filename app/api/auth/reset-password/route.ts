import { NextRequest } from "next/server";
import { putResetPassword } from "@/features/auth/api/reset-password";

export async function PUT(request: NextRequest) {
	return putResetPassword(request);
}

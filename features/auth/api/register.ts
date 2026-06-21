import { NextRequest } from "next/server";
import { RegisterRequest, RegisterResponse } from "@/features/auth/types/auth.types";
import { apiError, apiSuccess } from "@/shared/lib/api-response";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;

export async function postRegister(request: NextRequest) {
  try {
    const body: RegisterRequest = await request.json();

    if (!body.name || !body.phone || !body.registration_token) {
      return apiError("name, phone, and registration_token are required", 422);
    }

    const payload: RegisterRequest = {
      name: body.name.trim(),
      phone: body.phone.trim(),
      registration_token: body.registration_token.trim(),
      ...(body.email && { email: body.email.trim() }),
    };

    const backendRes = await fetch(`${BACKEND_URL}/api/v2/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(payload),
    });

    const data: RegisterResponse = await backendRes.json();
    if (!backendRes.ok) {
      return apiError("Failed to register", backendRes.status);
    }
    return apiSuccess<RegisterResponse>(data, backendRes.status);
  } catch {
    return apiError("Failed to register", 500);
  }
}

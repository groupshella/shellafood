import { GuestRequestResponse } from "@/features/auth/types/auth.types";
import { apiError, apiSuccess } from "@/shared/lib/api-response";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;

export async function postGuest() {
  try {
    const backendRes = await fetch(`${BACKEND_URL}/api/v1/auth/guest/request`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
    });
    const data: GuestRequestResponse = await backendRes.json();
    if (!backendRes.ok) {
      return apiError("Failed to create guest session", backendRes.status);
    }
    return apiSuccess<GuestRequestResponse>(data, backendRes.status);
  } catch {
    return apiError("Failed to create guest session", 500);
  }
}

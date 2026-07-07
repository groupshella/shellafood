import { cookies } from "next/headers";
import { COOKIE_KEYS } from "@/features/auth/types/auth.types";

export async function isAuthenticated(): Promise<boolean> {
    const cookieStore = await cookies();
    return Boolean(cookieStore.get(COOKIE_KEYS.ACCESS_TOKEN)?.value);
}

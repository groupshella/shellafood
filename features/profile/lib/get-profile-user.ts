import { cookies } from "next/headers";
import type { AuthUser } from "@/features/auth/types/auth.types";
import { COOKIE_KEYS } from "@/features/auth/types/auth.types";
export async function getProfileUser(): Promise<AuthUser | null> {
    const cookieStore = await cookies();
    const raw = cookieStore.get(COOKIE_KEYS.USER)?.value;
    if (!raw) return null;
    try {
        return JSON.parse(raw) as AuthUser;
    } catch {
        return null;
    }
}
export async function isProfileAuthenticated(): Promise<boolean> {
    const cookieStore = await cookies();
    return Boolean(cookieStore.get(COOKIE_KEYS.ACCESS_TOKEN)?.value);
}
// features/auth/lib/auth.lib.ts
"use client";

import type { AuthUser } from "@/features/auth/types/auth.types";

/** Persists the access token + user via the httpOnly session cookie route. */
export async function saveSession(token: string, user: AuthUser) {
    await fetch("/api/auth/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, user }),
    });
}

export async function saveGuestId(guestId: string) {
    await fetch("/api/auth/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ guest_id: guestId }),
    });
}

export async function getGuestId(): Promise<string | null> {
    if (typeof document === "undefined") return null;
    const match = document.cookie.match(/(?:^|; )guest_id=([^;]*)/);
    return match ? decodeURIComponent(match[1]) : null;
}

export async function clearSession() {
    await fetch("/api/auth/session", { method: "DELETE" });
}

export const ACCOUNT_EXISTS_ERROR =
    "يوجد حساب مرتبط بهذا الرقم بالفعل. يمكنك تسجيل الدخول أو استعادة كلمة المرور.";

export function getErrorMessage(err: unknown): string {
    if (err instanceof Error) return err.message;
    if (typeof err === "string") return err;
    return "حدث خطأ غير متوقع";
}

export function isAccountExistsError(message: string | null | undefined): boolean {
    if (!message) return false;
    return (
        message.includes("يوجد حساب مرتبط بهذا الرقم") ||
        message.includes("مرتبط بهذا الرقم بالفعل")
    );
}

/** Local 9-digit phone from +966XXXXXXXXX or raw digits. */
export function toLocalPhone(phone: string): string {
    return phone.replace(/\D/g, "").slice(-9);
}
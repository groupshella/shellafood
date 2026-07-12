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

export function getAccountExistsError(isArabic: boolean): string {
    return isArabic
        ? "يوجد حساب مرتبط بهذا الرقم بالفعل. يمكنك تسجيل الدخول أو استعادة كلمة المرور."
        : "An account is already linked to this number. You can sign in or recover your password.";
}

export const ACCOUNT_EXISTS_ERROR = getAccountExistsError(true);

export function getErrorMessage(err: unknown, isArabic = true): string {
    if (err instanceof Error) return err.message;
    if (typeof err === "string") return err;
    return isArabic ? "حدث خطأ غير متوقع" : "An unexpected error occurred";
}

export function isAccountExistsError(message: string | null | undefined): boolean {
    if (!message) return false;
    const lower = message.toLowerCase();
    return (
        message.includes("يوجد حساب مرتبط بهذا الرقم") ||
        message.includes("مرتبط بهذا الرقم بالفعل") ||
        lower.includes("already linked to this number") ||
        lower.includes("account already exists") ||
        lower.includes("phone has already been taken")
    );
}

/** Local 9-digit phone from +966XXXXXXXXX or raw digits. */
export function toLocalPhone(phone: string): string {
    return phone.replace(/\D/g, "").slice(-9);
}

// ─────────────────────────────────────────────────────────────────────────────
// Cookie Utility
// Client-side helpers that talk to /api/auth/session (an API route that sets
// httpOnly cookies so tokens are never exposed to JavaScript on the page).
// ─────────────────────────────────────────────────────────────────────────────

import { AuthUser, COOKIE_KEYS } from "@/features/auth/types/auth.types";

/** Persist token + user after a successful login or registration. */
export async function saveSession(token: string, user: AuthUser): Promise<void> {
    await fetch("/api/auth/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, user }),
    });
}

/** Persist a guest_id returned by the guest-request endpoint. */
export async function saveGuestId(guestId: string): Promise<void> {
    await fetch("/api/auth/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ guest_id: guestId }),
    });
}

/** Clear all auth cookies (logout). */
export async function clearSession(): Promise<void> {
    await fetch("/api/auth/session", { method: "DELETE" });
}

/**
 * Read a non-httpOnly cookie by name (readable from JS).
 * Only use this for non-sensitive values like guest_id.
 */
export function readCookie(name: string): string | null {
    if (typeof document === "undefined") return null;
    const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
    return match ? decodeURIComponent(match[1]) : null;
}

/** Read the guest_id from a non-httpOnly cookie. */
export function getGuestId(): string | null {
    return readCookie(COOKIE_KEYS.GUEST_ID);
}
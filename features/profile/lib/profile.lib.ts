import type { UserGender, AuthUser } from "@/features/auth/types/auth.types";
import { toSecureMediaUrl } from "@/shared/lib/media-url";

const API_BASE = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "";

/** Turn API-relative profile image paths into absolute (proxied) URLs the browser can load. */
export function resolveProfileImageUrl(src?: string | null): string | null {
    if (!src || src === "null") return null;
    if (/^(blob:|data:)/.test(src)) return src;
    if (/^https?:/.test(src)) return toSecureMediaUrl(src);
    if (src.startsWith("/")) return toSecureMediaUrl(`${API_BASE}${src}`);
    return toSecureMediaUrl(`${API_BASE}/${src}`);
}

export function splitFullName(fullName: string): { f_name: string; l_name: string } {
    const trimmed = fullName.trim();
    const [first, ...rest] = trimmed.split(/\s+/);
    if (!first) return { f_name: "", l_name: "" };
    return { f_name: first, l_name: rest.join(" ") || first };
}

export function formatLocalPhone(digits: string): string {
    const local = digits.replace(/\D/g, "").replace(/^966/, "");
    if (!local) return "";
    if (local.length <= 2) return local;
    if (local.length <= 5) return `${local.slice(0, 2)} ${local.slice(2)}`;
    if (local.length <= 8) return `${local.slice(0, 2)} ${local.slice(2, 5)} ${local.slice(5)}`;
    return `${local.slice(0, 2)} ${local.slice(2, 5)} ${local.slice(5, 9)}`;
}

export function formatPhoneDisplay(phone: string): { countryCode: string; localNumber: string } {
    const digits = phone.replace(/\D/g, "");
    if (digits.startsWith("966")) {
        const local = digits.slice(3);
        return {
            countryCode: "+966",
            localNumber: formatLocalPhone(local),
        };
    }
    return {
        countryCode: "+966",
        localNumber: formatLocalPhone(phone.replace(/^\+966/, "")),
    };
}

export function normalizeLocalPhone(value: string): string {
    return value.replace(/\D/g, "").replace(/^966/, "").slice(0, 9);
}

export function getGenderLabel(
    gender?: UserGender | null,
    lang: "ar" | "en" = "ar",
): string {
    const isArabic = lang === "ar";
    if (gender === "male") return isArabic ? "ذكر" : "Male";
    if (gender === "female") return isArabic ? "أنثى" : "Female";
    return isArabic ? "اختار الجنس" : "Select gender";
}

export function isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

/** Maps GET /customer/info response onto our AuthUser cookie shape. */
export function mapCustomerInfoToAuthUser(
    data: Record<string, unknown>,
    current: AuthUser | null,
): AuthUser {
    const apiName = typeof data.name === "string" ? data.name.trim() : "";
    const fromParts =
        data.f_name || data.l_name
            ? `${String(data.f_name ?? "")} ${String(data.l_name ?? "")}`.trim()
            : "";
    const fullName = apiName || fromParts || `${current?.f_name ?? ""} ${current?.l_name ?? ""}`.trim();
    const { f_name, l_name } = splitFullName(fullName);

    return {
        ...(current ?? ({} as AuthUser)),
        id: Number(data.id ?? current?.id ?? 0),
        f_name,
        l_name,
        name: apiName || fullName,
        email: typeof data.email === "string" ? data.email : current?.email ?? null,
        phone: String(data.phone ?? current?.phone ?? ""),
        image: resolveProfileImageUrl(
            typeof data.image === "string" ? data.image : current?.image ?? null,
        ),
        gender: (data.gender as UserGender | null | undefined) ?? current?.gender ?? null,
        loyalty_point: Number(data.loyalty_point ?? current?.loyalty_point ?? 0),
        wallet_balance: Number(data.wallet_balance ?? current?.wallet_balance ?? 0),
        has_qidha_wallet: Boolean(data.has_qidha_wallet ?? current?.has_qidha_wallet),
        qidha_wallet_signed: Boolean(data.qidha_wallet_signed ?? current?.qidha_wallet_signed),
        qidha_wallet_active: Boolean(data.qidha_wallet_active ?? current?.qidha_wallet_active),
        qidha_wallet_balance:
            data.qidha_wallet_balance != null
                ? Number(data.qidha_wallet_balance)
                : current?.qidha_wallet_balance ?? null,
        is_phone_verified: (data.is_phone_verified as 0 | 1) ?? current?.is_phone_verified ?? 0,
        is_email_verified: (data.is_email_verified as 0 | 1) ?? current?.is_email_verified ?? 0,
    };
}

function assignFieldError(
    errors: Record<string, string>,
    field: string,
    message: string,
): void {
    const key = field.toLowerCase();
    if (key.includes("name") || key === "f_name" || key === "l_name") {
        errors.name = message;
        return;
    }
    if (key.includes("email")) {
        errors.email = message;
        return;
    }
    if (key.includes("phone")) {
        errors.phone = message;
        return;
    }
    if (key.includes("image")) {
        errors.image = message;
        return;
    }
    errors.general = errors.general ? `${errors.general} · ${message}` : message;
}

/** Parses Laravel-style and array validation errors from the profile API. */
export function parseProfileFieldErrors(
    json: unknown,
    lang: "ar" | "en" = "ar",
): Record<string, string> {
    const fallback =
        lang === "ar" ? "تعذر حفظ التغييرات" : "Could not save changes";
    const errors: Record<string, string> = {};
    if (!json || typeof json !== "object") {
        return { general: fallback };
    }

    const body = json as Record<string, unknown>;

    if (Array.isArray(body.errors)) {
        for (const entry of body.errors) {
            if (!entry || typeof entry !== "object") continue;
            const item = entry as Record<string, unknown>;
            const field = String(item.code ?? item.field ?? item.key ?? "");
            const message = String(item.message ?? "");
            if (message) assignFieldError(errors, field, message);
        }
    } else if (body.errors && typeof body.errors === "object") {
        for (const [field, value] of Object.entries(body.errors as Record<string, unknown>)) {
            const message = Array.isArray(value) ? String(value[0] ?? "") : String(value ?? "");
            if (message) assignFieldError(errors, field, message);
        }
    }

    if (typeof body.message === "string" && body.message && !errors.general) {
        errors.general = body.message;
    }

    if (Object.keys(errors).length === 0) {
        errors.general = fallback;
    }

    return errors;
}

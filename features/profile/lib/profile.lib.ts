import type { UserGender } from "@/features/auth/types/auth.types";
import { PROFILE_STRINGS } from "@/features/profile/constants/profile.strings";

const API_BASE = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "";

/** Turn API-relative profile image paths into absolute URLs the browser can load. */
export function resolveProfileImageUrl(src?: string | null): string | null {
    if (!src || src === "null") return null;
    if (/^(https?:|blob:|data:)/.test(src)) return src;
    if (src.startsWith("/")) return `${API_BASE}${src}`;
    return `${API_BASE}/${src}`;
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

export function getGenderLabel(gender?: UserGender | null): string {
    if (gender === "male") return PROFILE_STRINGS.genderMale;
    if (gender === "female") return PROFILE_STRINGS.genderFemale;
    return PROFILE_STRINGS.selectGender;
}

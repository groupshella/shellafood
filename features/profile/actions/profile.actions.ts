"use server";

import { cookies } from "next/headers";
import { COOKIE_KEYS } from "@/features/auth/types/auth.types";
import type { AuthUser } from "@/features/auth/types/auth.types";
import { getServerLocale } from "@/features/language/getServerLocale";
import type { UpdateProfileResult } from "@/features/profile/types/profile.types";
import {
    mapCustomerInfoToAuthUser,
    parseProfileFieldErrors,
} from "@/features/profile/lib/profile.lib";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;
const IS_PROD = process.env.NODE_ENV === "production";
const COOKIE_OPTS = {
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
    sameSite: "lax" as const,
    secure: IS_PROD,
    httpOnly: false,
};

function message(isArabic: boolean, ar: string, en: string): string {
    return isArabic ? ar : en;
}

async function getToken(): Promise<string | null> {
    const cookieStore = await cookies();
    return cookieStore.get(COOKIE_KEYS.ACCESS_TOKEN)?.value ?? null;
}

async function getCurrentUser(): Promise<AuthUser | null> {
    const cookieStore = await cookies();
    const rawUser = cookieStore.get(COOKIE_KEYS.USER)?.value;
    if (!rawUser) return null;
    try {
        return JSON.parse(rawUser) as AuthUser;
    } catch {
        return null;
    }
}

async function persistUser(user: AuthUser) {
    const cookieStore = await cookies();
    cookieStore.set(COOKIE_KEYS.USER, JSON.stringify(user), COOKIE_OPTS);
}

async function fetchCustomerInfo(token: string, current: AuthUser | null): Promise<AuthUser | null> {
    const locale = await getServerLocale();

    const res = await fetch(`${BACKEND_URL}/api/v1/customer/info`, {
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "X-localization": locale,
        },
        cache: "no-store",
    });

    if (!res.ok) return null;

    const json = await res.json();
    const data = (json?.data ?? json?.user ?? json) as Record<string, unknown>;
    if (!data || typeof data !== "object") return null;

    return mapCustomerInfoToAuthUser(data, current);
}

export async function updateProfile(
    payload: {
        name: string;
        email: string;
        phone: string;
    },
    imageFile?: File | null,
): Promise<UpdateProfileResult> {
    const locale = await getServerLocale();
    const isArabic = locale === "ar";
    const token = await getToken();
    if (!token) {
        const unauthorized = message(isArabic, "غير مصرح", "Unauthorized");
        return { success: false, message: unauthorized, fieldErrors: { general: unauthorized } };
    }

    const currentUser = await getCurrentUser();
    const phone = payload.phone.trim();

    if (!phone) {
        const phoneRequired = message(isArabic, "رقم الهاتف مطلوب", "Phone number is required");
        return {
            success: false,
            message: phoneRequired,
            fieldErrors: { phone: phoneRequired },
        };
    }

    try {
        const formData = new FormData();
        formData.append("name", payload.name.trim());
        formData.append("email", payload.email.trim());
        formData.append("phone", phone);

        if (imageFile instanceof File && imageFile.size > 0) {
            formData.append("image", imageFile);
        }

        const res = await fetch(`${BACKEND_URL}/api/v1/customer/update-profile`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
                "X-localization": locale,
            },
            body: formData,
        });

        const json = await res.json();

        if (!res.ok) {
            const fieldErrors = parseProfileFieldErrors(json);
            const fallback = message(isArabic, "تعذر حفظ التغييرات", "Could not save changes");
            const errorMessage = fieldErrors.general ?? Object.values(fieldErrors)[0] ?? fallback;
            return { success: false, message: errorMessage, fieldErrors };
        }

        const refreshedUser = (await fetchCustomerInfo(token, currentUser)) ?? currentUser;

        const updatedUser: AuthUser = refreshedUser ?? {
            ...(currentUser ?? ({} as AuthUser)),
            f_name: payload.name.trim().split(/\s+/)[0] ?? "",
            l_name: payload.name.trim().split(/\s+/).slice(1).join(" ") || payload.name.trim(),
            name: payload.name.trim(),
            email: payload.email.trim(),
            phone,
        };

        await persistUser(updatedUser);

        return {
            success: true,
            message: typeof json?.message === "string"
                ? json.message
                : message(isArabic, "تم حفظ التغييرات بنجاح", "Changes saved successfully"),
            user: updatedUser,
        };
    } catch {
        const fallback = message(
            isArabic,
            "تعذر حفظ التغييرات، حاول مرة أخرى",
            "Could not save changes, please try again",
        );
        return {
            success: false,
            message: fallback,
            fieldErrors: { general: fallback },
        };
    }
}

export async function deleteAccount(): Promise<{ success: boolean; message: string }> {
    const locale = await getServerLocale();
    const isArabic = locale === "ar";
    const token = await getToken();
    if (!token) return { success: false, message: message(isArabic, "غير مصرح", "Unauthorized") };

    try {
        const res = await fetch(`${BACKEND_URL}/api/v1/customer/remove-account`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
                "Content-Type": "application/json",
                "X-localization": locale,
            },
            body: JSON.stringify({ _method: "delete" }),
        });

        const json = await res.json();

        if (!res.ok) {
            const fallback = message(isArabic, "تعذر حذف الحساب", "Could not delete account");
            const errorMessage = json?.errors?.[0]?.message ?? json?.message ?? fallback;
            return { success: false, message: errorMessage };
        }

        return {
            success: true,
            message: json?.message ?? message(isArabic, "تم حذف الحساب", "Account deleted"),
        };
    } catch {
        return {
            success: false,
            message: message(
                isArabic,
                "تعذر حذف الحساب، حاول مرة أخرى",
                "Could not delete account, please try again",
            ),
        };
    }
}

"use server";

import { cookies } from "next/headers";
import { COOKIE_KEYS } from "@/features/auth/types/auth.types";
import type { AuthUser } from "@/features/auth/types/auth.types";
import type { UpdateProfileResult } from "@/features/profile/types/profile.types";
import {
    fetchCustomerInfo,
    FINANCIAL_API,
} from "@/features/profile/lib/financial-http";
import {
    parseProfileFieldErrors,
} from "@/features/profile/lib/profile.lib";

const BACKEND_URL = FINANCIAL_API.baseUrl;
const IS_PROD = process.env.NODE_ENV === "production";
const COOKIE_OPTS = {
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
    sameSite: "lax" as const,
    secure: IS_PROD,
    httpOnly: false,
};

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

export async function refreshCustomerInfo(
    lang: "ar" | "en" = "ar",
): Promise<
    | { success: true; user: AuthUser }
    | { success: false; message: string }
> {
    const token = await getToken();
    const fallback = lang === "ar" ? "تعذر تحديث الرصيد" : "Could not refresh balance";
    if (!token || !BACKEND_URL) {
        return {
            success: false,
            message: lang === "ar" ? "غير مصرح" : "Unauthorized",
        };
    }

    try {
        const current = await getCurrentUser();
        const user = await fetchCustomerInfo(token, current, lang);
        if (!user) return { success: false, message: fallback };
        await persistUser(user);
        return { success: true, user };
    } catch {
        return { success: false, message: fallback };
    }
}

export async function updateProfile(
    payload: {
        name: string;
        email: string;
        phone: string;
    },
    imageFile?: File | null,
    lang: "ar" | "en" = "ar",
): Promise<UpdateProfileResult> {
    const isArabic = lang === "ar";
    const token = await getToken();
    if (!token) {
        const msg = isArabic ? "غير مصرح" : "Unauthorized";
        return { success: false, message: msg, fieldErrors: { general: msg } };
    }

    const currentUser = await getCurrentUser();
    const phone = payload.phone.trim();

    if (!phone) {
        const msg = isArabic ? "رقم الهاتف مطلوب" : "Phone number is required";
        return {
            success: false,
            message: msg,
            fieldErrors: { phone: msg },
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
                "Accept-Language": lang,
                "X-localization": lang,
                lang,
            },
            body: formData,
        });

        const json = await res.json();

        if (!res.ok) {
            const fieldErrors = parseProfileFieldErrors(json, lang);
            const message =
                fieldErrors.general ??
                Object.values(fieldErrors)[0] ??
                (isArabic ? "تعذر حفظ التغييرات" : "Could not save changes");
            return { success: false, message, fieldErrors };
        }

        const refreshedUser =
            (await fetchCustomerInfo(token, currentUser, lang)) ?? currentUser;

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
            message:
                typeof json?.message === "string"
                    ? json.message
                    : isArabic
                        ? "تم حفظ التغييرات بنجاح"
                        : "Changes saved successfully",
            user: updatedUser,
        };
    } catch {
        const msg = isArabic
            ? "تعذر حفظ التغييرات، حاول مرة أخرى"
            : "Could not save changes. Please try again";
        return {
            success: false,
            message: msg,
            fieldErrors: { general: msg },
        };
    }
}

export async function deleteAccount(
    lang: "ar" | "en" = "ar",
): Promise<{ success: boolean; message: string }> {
    const isArabic = lang === "ar";
    const token = await getToken();
    if (!token) {
        return { success: false, message: isArabic ? "غير مصرح" : "Unauthorized" };
    }

    try {
        const res = await fetch(`${BACKEND_URL}/api/v1/customer/remove-account`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
                "Content-Type": "application/json",
                "Accept-Language": lang,
                "X-localization": lang,
                lang,
            },
            body: JSON.stringify({ _method: "delete" }),
        });

        const json = await res.json();

        if (!res.ok) {
            const message =
                json?.errors?.[0]?.message ??
                json?.message ??
                (isArabic ? "تعذر حذف الحساب" : "Could not delete account");
            return { success: false, message };
        }

        return {
            success: true,
            message:
                json?.message ??
                (isArabic ? "تم حذف الحساب" : "Account deleted"),
        };
    } catch {
        return {
            success: false,
            message: isArabic
                ? "تعذر حذف الحساب، حاول مرة أخرى"
                : "Could not delete account. Please try again",
        };
    }
}

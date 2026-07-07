"use server";

import { cookies } from "next/headers";
import { COOKIE_KEYS } from "@/features/auth/types/auth.types";
import type { AuthUser } from "@/features/auth/types/auth.types";
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
    const res = await fetch(`${BACKEND_URL}/api/v1/customer/info`, {
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "X-localization": "ar",
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
    const token = await getToken();
    if (!token) {
        return { success: false, message: "غير مصرح", fieldErrors: { general: "غير مصرح" } };
    }

    const currentUser = await getCurrentUser();
    const phone = payload.phone.trim();

    if (!phone) {
        return {
            success: false,
            message: "رقم الهاتف مطلوب",
            fieldErrors: { phone: "رقم الهاتف مطلوب" },
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
                "X-localization": "ar",
            },
            body: formData,
        });

        const json = await res.json();

        if (!res.ok) {
            const fieldErrors = parseProfileFieldErrors(json);
            const message = fieldErrors.general ?? Object.values(fieldErrors)[0] ?? "تعذر حفظ التغييرات";
            return { success: false, message, fieldErrors };
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
            message: typeof json?.message === "string" ? json.message : "تم حفظ التغييرات بنجاح",
            user: updatedUser,
        };
    } catch {
        return {
            success: false,
            message: "تعذر حفظ التغييرات، حاول مرة أخرى",
            fieldErrors: { general: "تعذر حفظ التغييرات، حاول مرة أخرى" },
        };
    }
}

export async function deleteAccount(): Promise<{ success: boolean; message: string }> {
    const token = await getToken();
    if (!token) return { success: false, message: "غير مصرح" };

    try {
        const res = await fetch(`${BACKEND_URL}/api/v1/customer/remove-account`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
                "Content-Type": "application/json",
                "X-localization": "ar",
            },
            body: JSON.stringify({ _method: "delete" }),
        });

        const json = await res.json();

        if (!res.ok) {
            const message = json?.errors?.[0]?.message ?? json?.message ?? "تعذر حذف الحساب";
            return { success: false, message };
        }

        return { success: true, message: json?.message ?? "تم حذف الحساب" };
    } catch {
        return { success: false, message: "تعذر حذف الحساب، حاول مرة أخرى" };
    }
}

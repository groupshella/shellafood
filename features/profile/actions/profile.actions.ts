"use server";

import { cookies } from "next/headers";
import { COOKIE_KEYS } from "@/features/auth/types/auth.types";
import type { AuthUser, UserGender } from "@/features/auth/types/auth.types";
import type { UpdateProfileResult } from "@/features/profile/types/profile.types";
import { resolveProfileImageUrl } from "@/features/profile/lib/profile.lib";

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

async function persistUser(user: AuthUser) {
    const cookieStore = await cookies();
    cookieStore.set(COOKIE_KEYS.USER, JSON.stringify(user), COOKIE_OPTS);
}

export async function updateProfile(
    payload: {
        f_name: string;
        l_name: string;
        email: string;
        gender?: UserGender | null;
    },
    imageFile?: File | null,
): Promise<UpdateProfileResult> {
    const token = await getToken();
    if (!token) return { success: false, message: "غير مصرح" };

    try {
        const formData = new FormData();
        formData.append("f_name", payload.f_name);
        formData.append("l_name", payload.l_name);
        formData.append("email", payload.email);
        if (payload.gender) formData.append("gender", payload.gender);
        if (imageFile) formData.append("image", imageFile);

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
            const message = json?.errors?.[0]?.message ?? json?.message ?? "تعذر حفظ التغييرات";
            return { success: false, message };
        }

        const cookieStore = await cookies();
        const rawUser = cookieStore.get(COOKIE_KEYS.USER)?.value;
        const currentUser: AuthUser | null = rawUser ? JSON.parse(rawUser) : null;

        const updatedUser: AuthUser = {
            ...(currentUser ?? ({} as AuthUser)),
            f_name: payload.f_name,
            l_name: payload.l_name,
            email: payload.email,
            gender: payload.gender ?? currentUser?.gender ?? null,
            image: resolveProfileImageUrl(json?.image ?? json?.user?.image ?? currentUser?.image ?? null),
        };

        await persistUser(updatedUser);

        return { success: true, message: json?.message ?? "تم الحفظ", user: updatedUser };
    } catch {
        return { success: false, message: "تعذر حفظ التغييرات، حاول مرة أخرى" };
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

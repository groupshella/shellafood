"use server";

import { cookies } from "next/headers";
import { COOKIE_KEYS } from "@/features/auth/types/auth.types";
import type {
    CheckRegistrationResult,
    DelegateStatusResult,
    JoinActionResult,
    RegisterDelegatePayload,
    RegisterDriverPayload,
    Vehicle,
    Zone,
} from "@/features/profile/types/join.types";

const BASE = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "";

async function getToken(): Promise<string | null> {
    const cookieStore = await cookies();
    return cookieStore.get(COOKIE_KEYS.ACCESS_TOKEN)?.value ?? null;
}

function buildHeaders(token: string | null, extra?: Record<string, string>) {
    const h: Record<string, string> = {
        Accept: "application/json",
        "X-localization": "ar",
        ...extra,
    };
    if (token) h.Authorization = `Bearer ${token}`;
    return h;
}

function parseFieldErrors(json: unknown): Partial<Record<string, string>> {
    const errors: Record<string, string> = {};
    if (!json || typeof json !== "object") return { general: "حدث خطأ، حاول مرة أخرى" };

    const body = json as Record<string, unknown>;

    if (Array.isArray(body.errors)) {
        for (const e of body.errors) {
            if (!e || typeof e !== "object") continue;
            const item = e as Record<string, unknown>;
            const field = String(item.code ?? item.field ?? item.key ?? "general");
            const message = String(item.message ?? "");
            if (message) errors[field] = message;
        }
    } else if (body.errors && typeof body.errors === "object") {
        for (const [field, value] of Object.entries(body.errors as Record<string, unknown>)) {
            const msg = Array.isArray(value) ? String(value[0] ?? "") : String(value ?? "");
            if (msg) errors[field] = msg;
        }
    }

    if (typeof body.message === "string" && body.message && !errors.general) {
        errors.general = body.message;
    }

    if (Object.keys(errors).length === 0) errors.general = "حدث خطأ، حاول مرة أخرى";

    return errors;
}

// ── Helpers ─────────────────────────────────────────────────────────────────

export async function fetchZones(): Promise<Zone[]> {
    try {
        const res = await fetch(`${BASE}/api/v1/zone/list`, {
            headers: { Accept: "application/json" },
            next: { revalidate: 300 },
        });
        if (!res.ok) return [];
        const json = await res.json();
        const list = Array.isArray(json?.zones) ? json.zones : Array.isArray(json) ? json : [];
        return list.map((z: Record<string, unknown>) => ({
            id: String(z.id ?? ""),
            name: String(z.name ?? ""),
        }));
    } catch {
        return [];
    }
}

export async function fetchVehicles(): Promise<Vehicle[]> {
    try {
        const res = await fetch(`${BASE}/api/v1/get-vehicles`, {
            headers: { Accept: "application/json" },
            next: { revalidate: 300 },
        });
        if (!res.ok) return [];
        const json = await res.json();
        const list = Array.isArray(json?.vehicles) ? json.vehicles : Array.isArray(json) ? json : [];
        return list.map((v: Record<string, unknown>) => ({
            id: String(v.id ?? ""),
            type: String(v.type ?? v.name ?? ""),
        }));
    } catch {
        return [];
    }
}

// ── Delivery-Man ─────────────────────────────────────────────────────────────

export async function checkDriverRegistration(payload: {
    phone?: string;
    email?: string;
    identity_number?: string;
}): Promise<CheckRegistrationResult> {
    const token = await getToken();

    const tryEndpoint = async (endpoint: string, tkn: string | null) => {
        const res = await fetch(`${BASE}${endpoint}`, {
            method: "POST",
            headers: {
                ...buildHeaders(tkn),
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });
        return res;
    };

    try {
        let res = token
            ? await tryEndpoint("/api/v1/customer/delivery-man/check-registration", token)
            : null;

        if (!res || !res.ok) {
            res = await tryEndpoint("/api/v1/auth/delivery-man/check-registration", null);
        }

        const json = await res.json();
        const rawStatus = String(
            json?.status ??
                json?.registration_status ??
                json?.delivery_man_status ??
                json?.application_status ??
                "",
        ).toLowerCase();

        const mappedStatus: CheckRegistrationResult["status"] =
            rawStatus === "pending"
                ? "pending"
                : rawStatus === "approved" || rawStatus === "active"
                  ? rawStatus === "active"
                      ? "active"
                      : "approved"
                  : rawStatus === "rejected"
                    ? "rejected"
                    : json?.is_registered === true ||
                        json?.registered === true ||
                        json?.exists === true
                      ? "registered"
                      : "none";

        const isRegistered = mappedStatus !== "none";

        return {
            isRegistered,
            status: mappedStatus,
            message: typeof json?.message === "string" ? json.message : undefined,
        };
    } catch {
        return { isRegistered: false, status: "none" };
    }
}

export async function registerDriver(
    payload: RegisterDriverPayload,
): Promise<JoinActionResult> {
    const token = await getToken();

    try {
        const formData = new FormData();
        const localPhone = payload.phone.replace(/^\+966/, "").replace(/\D/g, "");
        formData.append("f_name", payload.f_name);
        formData.append("email", payload.email);
        formData.append("phone", `+966${localPhone}`);
        formData.append("password", payload.password);
        formData.append("zone_id", payload.zone_id);
        formData.append("vehicle_id", payload.vehicle_id);
        formData.append("earning", payload.earning);
        formData.append("identity_type", payload.identity_type);
        formData.append("identity_number", payload.identity_number);

        for (const file of payload.identity_images) {
            formData.append("identity_image[]", file);
        }
        for (const file of payload.driving_license_images) {
            formData.append("driving_license_image[]", file);
        }
        for (const file of payload.driver_license_images) {
            formData.append("driver_license_image[]", file);
        }

        const res = await fetch(`${BASE}/api/v1/auth/delivery-man/store`, {
            method: "POST",
            headers: buildHeaders(token),
            body: formData,
        });

        const json = await res.json();

        if (!res.ok) {
            return {
                success: false,
                message: typeof json?.message === "string" ? json.message : "تعذر إرسال الطلب",
                fieldErrors: parseFieldErrors(json),
            };
        }

        return {
            success: true,
            message: typeof json?.message === "string" ? json.message : "تم إرسال طلب انضمامك بنجاح",
        };
    } catch {
        return {
            success: false,
            message: "تعذر الاتصال بالخادم، حاول مرة أخرى",
            fieldErrors: { general: "تعذر الاتصال بالخادم، حاول مرة أخرى" },
        };
    }
}

// ── Delegate (Voucher Rep) ────────────────────────────────────────────────────

export async function fetchDelegateStatus(): Promise<DelegateStatusResult> {
    const token = await getToken();
    if (!token) return { status: "none", message: "غير مصرح" };

    try {
        const res = await fetch(`${BASE}/api/v1/customer/delegate/get-delegate-status`, {
            headers: buildHeaders(token),
            cache: "no-store",
        });

        if (!res.ok) return { status: "none" };

        const json = await res.json();
        const raw = String(
            json?.delegate_status ?? json?.status ?? "none",
        ).toLowerCase();

        const status = (
            ["pending", "approved", "rejected", "active"].includes(raw)
                ? raw === "active"
                    ? "approved"
                    : raw
                : "none"
        ) as "pending" | "approved" | "rejected" | "none";

        return { status };
    } catch {
        return { status: "none" };
    }
}

export async function registerDelegate(
    payload: RegisterDelegatePayload,
): Promise<JoinActionResult> {
    const token = await getToken();
    if (!token) {
        return {
            success: false,
            message: "يجب تسجيل الدخول أولاً",
            fieldErrors: { general: "يجب تسجيل الدخول أولاً" },
        };
    }

    try {
        const localMobile = payload.mobile.replace(/^\+966/, "").replace(/\D/g, "");
        const formData = new FormData();
        formData.append("user_id", payload.user_id);
        formData.append("f_name", payload.f_name);
        formData.append("l_name", payload.l_name);
        formData.append("mobile", `+966${localMobile}`);
        formData.append("id_photo_name", payload.id_photo_name);
        formData.append("id_photo", payload.id_photo);

        const res = await fetch(`${BASE}/api/v1/customer/delegate/store`, {
            method: "POST",
            headers: buildHeaders(token),
            body: formData,
        });

        const json = await res.json();

        if (!res.ok) {
            // Normalize backend field keys to match our form keys
            const rawErrors = parseFieldErrors(json);
            // backend may return "phone" but our form key is "mobile"
            if (rawErrors.phone && !rawErrors.mobile) {
                rawErrors.mobile = rawErrors.phone;
                delete rawErrors.phone;
            }
            return {
                success: false,
                message: typeof json?.message === "string" ? json.message : "تعذر إرسال الطلب",
                fieldErrors: rawErrors,
            };
        }

        return {
            success: true,
            message: typeof json?.message === "string" ? json.message : "تم إرسال طلب انضمامك بنجاح",
        };
    } catch {
        return {
            success: false,
            message: "تعذر الاتصال بالخادم، حاول مرة أخرى",
            fieldErrors: { general: "تعذر الاتصال بالخادم، حاول مرة أخرى" },
        };
    }
}

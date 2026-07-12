"use server";

import { cookies } from "next/headers";
import { COOKIE_KEYS } from "@/features/auth/types/auth.types";
import { getServerLocale } from "@/features/language/getServerLocale";
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
type Locale = "ar" | "en";
type LocalizedMessage = { ar: string; en: string };

const FALLBACK_MESSAGES = {
    genericError: {
        ar: "حدث خطأ، حاول مرة أخرى",
        en: "Something went wrong, please try again",
    },
    invalidInput: {
        ar: "البيانات المدخلة غير صالحة",
        en: "Invalid input data",
    },
    submitFailed: {
        ar: "تعذر إرسال الطلب",
        en: "Could not submit the request",
    },
    submitSuccess: {
        ar: "تم إرسال طلب انضمامك بنجاح",
        en: "Your join request was submitted successfully",
    },
    connectionFailed: {
        ar: "تعذر الاتصال بالخادم، حاول مرة أخرى",
        en: "Could not connect to the server, please try again",
    },
    unauthorized: {
        ar: "غير مصرح",
        en: "Unauthorized",
    },
    signInRequired: {
        ar: "يجب تسجيل الدخول أولاً",
        en: "You must sign in first",
    },
} as const;

function message(copy: LocalizedMessage, isArabic: boolean): string {
    return isArabic ? copy.ar : copy.en;
}

async function getToken(): Promise<string | null> {
    const cookieStore = await cookies();
    return cookieStore.get(COOKIE_KEYS.ACCESS_TOKEN)?.value ?? null;
}

function buildHeaders(token: string | null, locale: Locale, extra?: Record<string, string>) {
    const h: Record<string, string> = {
        Accept: "application/json",
        "X-localization": locale,
        ...extra,
    };
    if (token) h.Authorization = `Bearer ${token}`;
    return h;
}

// ── Backend validation key → localized copy ──────────────────────────────────

const BACKEND_MESSAGES: Record<string, LocalizedMessage> = {
    // Password rules
    "messages.validation.password.letters": {
        ar: "كلمة المرور يجب أن تحتوي على حروف",
        en: "Password must contain letters",
    },
    "messages.validation.password.mixed": {
        ar: "كلمة المرور يجب أن تحتوي على حروف كبيرة وصغيرة",
        en: "Password must contain uppercase and lowercase letters",
    },
    "messages.validation.password.numbers": {
        ar: "كلمة المرور يجب أن تحتوي على أرقام",
        en: "Password must contain numbers",
    },
    "messages.validation.password.symbols": {
        ar: "كلمة المرور يجب أن تحتوي على رموز خاصة",
        en: "Password must contain special characters",
    },
    "validation.password.letters": {
        ar: "كلمة المرور يجب أن تحتوي على حروف",
        en: "Password must contain letters",
    },
    "validation.password.mixed": {
        ar: "كلمة المرور يجب أن تحتوي على حروف كبيرة وصغيرة",
        en: "Password must contain uppercase and lowercase letters",
    },
    "validation.password.numbers": {
        ar: "كلمة المرور يجب أن تحتوي على أرقام",
        en: "Password must contain numbers",
    },
    "validation.password.symbols": {
        ar: "كلمة المرور يجب أن تحتوي على رموز خاصة",
        en: "Password must contain special characters",
    },
    // Core validations (with messages. prefix)
    "messages.validation.required": {
        ar: "هذا الحقل مطلوب",
        en: "This field is required",
    },
    "messages.validation.email": {
        ar: "صيغة البريد الإلكتروني غير صالحة",
        en: "Invalid email format",
    },
    "messages.validation.unique": {
        ar: "هذه القيمة مسجلة مسبقاً",
        en: "This value is already registered",
    },
    "messages.validation.exists": {
        ar: "القيمة المدخلة غير موجودة",
        en: "The entered value does not exist",
    },
    "messages.validation.confirmed": {
        ar: "كلمتا المرور غير متطابقتين",
        en: "Passwords do not match",
    },
    "messages.validation.same": {
        ar: "القيمتان يجب أن تتطابقا",
        en: "The two values must match",
    },
    "messages.validation.different": {
        ar: "القيمتان يجب أن تختلفا",
        en: "The two values must be different",
    },
    "messages.validation.min.string": {
        ar: "الحقل أقصر من الحد المطلوب",
        en: "This field is shorter than the required minimum",
    },
    "messages.validation.max.string": {
        ar: "الحقل أطول من الحد المسموح",
        en: "This field exceeds the allowed length",
    },
    "messages.validation.min.numeric": {
        ar: "القيمة أصغر من الحد المطلوب",
        en: "The value is below the required minimum",
    },
    "messages.validation.max.numeric": {
        ar: "القيمة أكبر من الحد المسموح",
        en: "The value exceeds the allowed maximum",
    },
    "messages.validation.numeric": {
        ar: "يجب أن يكون رقماً",
        en: "This field must be a number",
    },
    "messages.validation.integer": {
        ar: "يجب أن يكون عدداً صحيحاً",
        en: "This field must be an integer",
    },
    "messages.validation.string": {
        ar: "يجب أن يكون نصاً",
        en: "This field must be text",
    },
    "messages.validation.boolean": {
        ar: "يجب أن يكون قيمة منطقية",
        en: "This field must be a boolean value",
    },
    "messages.validation.array": {
        ar: "يجب أن يكون قائمة",
        en: "This field must be a list",
    },
    "messages.validation.image": {
        ar: "يجب أن يكون ملف صورة",
        en: "The uploaded file must be an image",
    },
    "messages.validation.mimes": {
        ar: "نوع الملف غير مدعوم",
        en: "This file type is not supported",
    },
    "messages.validation.file": {
        ar: "يجب رفع ملف",
        en: "A file must be uploaded",
    },
    "messages.validation.regex": {
        ar: "الصيغة المدخلة غير صالحة",
        en: "Invalid format",
    },
    "messages.validation.in": {
        ar: "الاختيار غير صالح",
        en: "Invalid selection",
    },
    "messages.validation.not_in": {
        ar: "الاختيار غير مسموح",
        en: "This selection is not allowed",
    },
    "messages.validation.digits": {
        ar: "يجب أن يكون عدداً بالأرقام المحددة",
        en: "This field must contain the specified number of digits",
    },
    "messages.validation.digits_between": {
        ar: "يجب أن يكون بين عدد معين من الأرقام",
        en: "This field must contain digits within the allowed range",
    },
    // Without messages. prefix
    "validation.required": {
        ar: "هذا الحقل مطلوب",
        en: "This field is required",
    },
    "validation.email": {
        ar: "صيغة البريد الإلكتروني غير صالحة",
        en: "Invalid email format",
    },
    "validation.unique": {
        ar: "هذه القيمة مسجلة مسبقاً",
        en: "This value is already registered",
    },
    "validation.exists": {
        ar: "القيمة المدخلة غير موجودة",
        en: "The entered value does not exist",
    },
    "validation.confirmed": {
        ar: "كلمتا المرور غير متطابقتين",
        en: "Passwords do not match",
    },
    "validation.min.string": {
        ar: "الحقل أقصر من الحد المطلوب",
        en: "This field is shorter than the required minimum",
    },
    "validation.max.string": {
        ar: "الحقل أطول من الحد المسموح",
        en: "This field exceeds the allowed length",
    },
    "validation.numeric": {
        ar: "يجب أن يكون رقماً",
        en: "This field must be a number",
    },
    "validation.integer": {
        ar: "يجب أن يكون عدداً صحيحاً",
        en: "This field must be an integer",
    },
    "validation.image": {
        ar: "يجب أن يكون ملف صورة",
        en: "The uploaded file must be an image",
    },
    "validation.mimes": {
        ar: "نوع الملف غير مدعوم",
        en: "This file type is not supported",
    },
    "validation.file": {
        ar: "يجب رفع ملف",
        en: "A file must be uploaded",
    },
    "validation.regex": {
        ar: "الصيغة المدخلة غير صالحة",
        en: "Invalid format",
    },
    "validation.in": {
        ar: "الاختيار غير صالح",
        en: "Invalid selection",
    },
};

/** Translate a backend validation key. Returns the original string if it is already human-readable. */
function translateMessage(msg: string, isArabic: boolean): string {
    if (!msg) return msg;
    const hit = BACKEND_MESSAGES[msg];
    if (hit) return message(hit, isArabic);
    // Detect raw translation keys and show a generic fallback
    if (/^(messages\.)?validation\./i.test(msg)) return message(FALLBACK_MESSAGES.invalidInput, isArabic);
    return msg;
}

// ── Field name maps: backend → frontend form keys ────────────────────────────

const DRIVER_FIELD_MAP: Record<string, string> = {
    f_name:                   "firstName",
    email:                    "email",
    phone:                    "phone",
    password:                 "password",
    password_confirmation:    "confirmPassword",
    zone_id:                  "zoneId",
    vehicle_id:               "vehicleId",
    earning:                  "earning",
    identity_type:            "identityType",
    identity_number:          "identityNumber",
    "identity_image":         "identityImages",
    "identity_images":        "identityImages",
    "driving_license_image":  "drivingLicenseImages",
    "driving_license_images": "drivingLicenseImages",
    "driver_license_image":   "driverLicenseImages",
    "driver_license_images":  "driverLicenseImages",
};

const DELEGATE_FIELD_MAP: Record<string, string> = {
    f_name:       "firstName",
    l_name:       "lastName",
    mobile:       "mobile",
    phone:        "mobile",
    id_photo:     "idPhoto",
    id_photo_name: "idPhoto",
    user_id:      "general",
};

/** Map a backend field name (possibly with array suffix like "identity_image.0") to the frontend key. */
function mapField(raw: string, fieldMap: Record<string, string>): string {
    const base = raw.replace(/\.\d+$/, ""); // strip ".0", ".1", ...
    return fieldMap[base] ?? fieldMap[raw] ?? "general";
}

// ── Error parser ─────────────────────────────────────────────────────────────

function parseFieldErrors(
    json: unknown,
    fieldMap: Record<string, string> = {},
    isArabic: boolean,
): Partial<Record<string, string>> {
    const errors: Record<string, string> = {};
    if (!json || typeof json !== "object") {
        return { general: message(FALLBACK_MESSAGES.genericError, isArabic) };
    }

    const body = json as Record<string, unknown>;
    const useMap = Object.keys(fieldMap).length > 0;

    const assign = (rawField: string, rawMsg: string) => {
        const msg = translateMessage(rawMsg.trim(), isArabic);
        if (!msg) return;
        const key = useMap ? mapField(rawField, fieldMap) : rawField;
        // Accumulate general errors; take the first message for field errors
        if (key === "general") {
            errors.general = errors.general ? `${errors.general} · ${msg}` : msg;
        } else if (!errors[key]) {
            errors[key] = msg;
        }
    };

    if (Array.isArray(body.errors)) {
        for (const e of body.errors) {
            if (!e || typeof e !== "object") continue;
            const item = e as Record<string, unknown>;
            const field = String(item.code ?? item.field ?? item.key ?? "general");
            const message = String(item.message ?? "");
            if (message) assign(field, message);
        }
    } else if (body.errors && typeof body.errors === "object") {
        for (const [field, value] of Object.entries(body.errors as Record<string, unknown>)) {
            const msg = Array.isArray(value) ? String(value[0] ?? "") : String(value ?? "");
            if (msg) assign(field, msg);
        }
    }

    if (typeof body.message === "string" && body.message) {
        const translated = translateMessage(body.message.trim(), isArabic);
        if (translated && !errors.general) errors.general = translated;
    }

    if (Object.keys(errors).length === 0) {
        errors.general = message(FALLBACK_MESSAGES.genericError, isArabic);
    }

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
    const locale = await getServerLocale();
    const isArabic = locale === "ar";
    const token = await getToken();

    const tryEndpoint = async (endpoint: string, tkn: string | null) => {
        const res = await fetch(`${BASE}${endpoint}`, {
            method: "POST",
            headers: {
                ...buildHeaders(tkn, locale),
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
        const isRegistered: boolean =
            json?.is_registered === true ||
            json?.registered === true ||
            json?.exists === true ||
            false;

        return {
            isRegistered,
            message: typeof json?.message === "string" ? translateMessage(json.message, isArabic) : undefined,
        };
    } catch {
        return { isRegistered: false };
    }
}

export async function registerDriver(
    payload: RegisterDriverPayload,
): Promise<JoinActionResult> {
    const locale = await getServerLocale();
    const isArabic = locale === "ar";
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
            headers: buildHeaders(token, locale),
            body: formData,
        });

        const json = await res.json();

        if (!res.ok) {
            return {
                success: false,
                message: typeof json?.message === "string"
                    ? translateMessage(json.message, isArabic)
                    : message(FALLBACK_MESSAGES.submitFailed, isArabic),
                fieldErrors: parseFieldErrors(json, DRIVER_FIELD_MAP, isArabic),
            };
        }

        return {
            success: true,
            message: typeof json?.message === "string"
                ? translateMessage(json.message, isArabic)
                : message(FALLBACK_MESSAGES.submitSuccess, isArabic),
        };
    } catch {
        const fallback = message(FALLBACK_MESSAGES.connectionFailed, isArabic);
        return {
            success: false,
            message: fallback,
            fieldErrors: { general: fallback },
        };
    }
}

// ── Delegate (Voucher Rep) ────────────────────────────────────────────────────

export async function fetchDelegateStatus(): Promise<DelegateStatusResult> {
    const locale = await getServerLocale();
    const isArabic = locale === "ar";
    const token = await getToken();
    if (!token) return { status: "none", message: message(FALLBACK_MESSAGES.unauthorized, isArabic) };

    try {
        const res = await fetch(`${BASE}/api/v1/customer/delegate/get-delegate-status`, {
            headers: buildHeaders(token, locale),
            cache: "no-store",
        });

        if (!res.ok) return { status: "none" };

        const json = await res.json();
        const raw = String(json?.delegate_status ?? json?.status ?? "none");
        const status = (["pending", "approved", "rejected"].includes(raw) ? raw : "none") as
            | "pending"
            | "approved"
            | "rejected"
            | "none";

        return { status };
    } catch {
        return { status: "none" };
    }
}

export async function registerDelegate(
    payload: RegisterDelegatePayload,
): Promise<JoinActionResult> {
    const locale = await getServerLocale();
    const isArabic = locale === "ar";
    const token = await getToken();
    if (!token) {
        const fallback = message(FALLBACK_MESSAGES.signInRequired, isArabic);
        return {
            success: false,
            message: fallback,
            fieldErrors: { general: fallback },
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
            headers: buildHeaders(token, locale),
            body: formData,
        });

        const json = await res.json();

        if (!res.ok) {
            return {
                success: false,
                message: typeof json?.message === "string"
                    ? translateMessage(json.message, isArabic)
                    : message(FALLBACK_MESSAGES.submitFailed, isArabic),
                fieldErrors: parseFieldErrors(json, DELEGATE_FIELD_MAP, isArabic),
            };
        }

        return {
            success: true,
            message: typeof json?.message === "string"
                ? translateMessage(json.message, isArabic)
                : message(FALLBACK_MESSAGES.submitSuccess, isArabic),
        };
    } catch {
        const fallback = message(FALLBACK_MESSAGES.connectionFailed, isArabic);
        return {
            success: false,
            message: fallback,
            fieldErrors: { general: fallback },
        };
    }
}

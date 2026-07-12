"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
    checkDriverRegistration,
    fetchVehicles,
    fetchZones,
    registerDriver,
} from "@/features/profile/actions/join.actions";
import { useLanguage } from "@/features/language/useLanguage";
import { validateUploadFile } from "@/features/profile/lib/upload.lib";
import { MAX_UPLOAD_BYTES } from "@/features/profile/constants/join.strings";
import { isValidEmail } from "@/features/profile/lib/profile.lib";
import type {
    EarningType,
    IdentityType,
    JoinActionResult,
    Vehicle,
    Zone,
} from "@/features/profile/types/join.types";

export interface DriverFormState {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;
    confirmPassword: string;
    identityType: IdentityType | "";
    identityNumber: string;
    zoneId: string;
    vehicleId: string;
    earning: EarningType | "";
    identityImages: File[];
    drivingLicenseImages: File[];
    driverLicenseImages: File[];
    agreed: boolean;
}

const INITIAL_FORM: DriverFormState = {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    identityType: "",
    identityNumber: "",
    zoneId: "",
    vehicleId: "",
    earning: "",
    identityImages: [],
    drivingLicenseImages: [],
    driverLicenseImages: [],
    agreed: false,
};

/** Saudi phone: 9 digits, must start with 5 */
function isValidSaudiPhone(digits: string): boolean {
    return /^5\d{8}$/.test(digits.replace(/^\+966/, "").replace(/\D/g, ""));
}

export interface UseDriverRegistrationReturn {
    form: DriverFormState;
    setField: <K extends keyof DriverFormState>(key: K, value: DriverFormState[K]) => void;
    zones: Zone[];
    vehicles: Vehicle[];
    isLoadingMeta: boolean;
    metaLoadError: boolean;
    retryMeta: () => void;
    /** True while the on-mount prior-registration check is running. */
    isCheckingRegistration: boolean;
    /** True if the token-based check detected an existing registration. */
    isAlreadyRegistered: boolean;
    /** Human-readable message from the prior-registration check. */
    registrationCheckMsg: string;
    isSubmitting: boolean;
    fieldErrors: Partial<Record<string, string>>;
    clearFieldError: (key: string) => void;
    handleAddFile: (
        field: "identityImages" | "drivingLicenseImages" | "driverLicenseImages",
        file: File,
    ) => string | null;
    handleRemoveFile: (
        field: "identityImages" | "drivingLicenseImages" | "driverLicenseImages",
        index: number,
    ) => void;
    submit: () => Promise<JoinActionResult>;
}

export function useDriverRegistration(): UseDriverRegistrationReturn {
    const { isArabic } = useLanguage();
    const [form, setForm] = useState<DriverFormState>(INITIAL_FORM);
    const [zones, setZones] = useState<Zone[]>([]);
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [isLoadingMeta, setIsLoadingMeta] = useState(true);
    const [metaLoadError, setMetaLoadError] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [fieldErrors, setFieldErrors] = useState<Partial<Record<string, string>>>({});
    const submittingRef = useRef(false);
    const [metaRetryKey, setMetaRetryKey] = useState(0);

    // ── On-mount prior-registration check (sends {} with auth token) ──────────
    const [isCheckingRegistration, setIsCheckingRegistration] = useState(true);
    const [isAlreadyRegistered, setIsAlreadyRegistered] = useState(false);
    const [registrationCheckMsg, setRegistrationCheckMsg] = useState("");

    useEffect(() => {
        setIsCheckingRegistration(true);
        checkDriverRegistration({})
            .then((result) => {
                if (result.isRegistered) {
                    setIsAlreadyRegistered(true);
                    setRegistrationCheckMsg(
                        result.message ?? (isArabic ? "هذا الحساب مسجل مسبقاً" : "This account is already registered"),
                    );
                }
            })
            .catch(() => {
                // Silently fail — don't block the form if the check errors
            })
            .finally(() => setIsCheckingRegistration(false));
    }, [isArabic]);

    useEffect(() => {
        setIsLoadingMeta(true);
        setMetaLoadError(false);
        Promise.all([fetchZones(), fetchVehicles()])
            .then(([z, v]) => {
                setZones(z);
                setVehicles(v);
                if (z.length === 0 && v.length === 0) setMetaLoadError(true);
            })
            .catch(() => setMetaLoadError(true))
            .finally(() => setIsLoadingMeta(false));
    }, [metaRetryKey]);

    const retryMeta = useCallback(() => setMetaRetryKey((k) => k + 1), []);

    const setField = useCallback(
        <K extends keyof DriverFormState>(key: K, value: DriverFormState[K]) => {
            setForm((prev) => ({ ...prev, [key]: value }));
        },
        [],
    );

    const clearFieldError = useCallback((key: string) => {
        setFieldErrors((prev) => {
            if (!prev[key]) return prev;
            const next = { ...prev };
            delete next[key];
            return next;
        });
    }, []);

    const handleAddFile = useCallback(
        (
            field: "identityImages" | "drivingLicenseImages" | "driverLicenseImages",
            file: File,
        ): string | null => {
            const err = validateUploadFile(file, MAX_UPLOAD_BYTES);
            if (err) return isArabic ? "حجم الملف يجب ألا يتجاوز 2 ميجا" : "File size must not exceed 2 MB";
            setForm((prev) => ({ ...prev, [field]: [...prev[field], file] }));
            setFieldErrors((prev) => {
                if (!prev[field]) return prev;
                const next = { ...prev };
                delete next[field];
                return next;
            });
            return null;
        },
        [isArabic],
    );

    const handleRemoveFile = useCallback(
        (
            field: "identityImages" | "drivingLicenseImages" | "driverLicenseImages",
            index: number,
        ) => {
            setForm((prev) => ({
                ...prev,
                [field]: prev[field].filter((_, i) => i !== index),
            }));
        },
        [],
    );

    const validate = (f: DriverFormState): Partial<Record<string, string>> | null => {
        const errors: Record<string, string> = {};

        if (!f.firstName.trim()) errors.firstName = isArabic ? "هذا الحقل مطلوب" : "This field is required";

        if (!f.email.trim()) {
            errors.email = isArabic ? "هذا الحقل مطلوب" : "This field is required";
        } else if (!isValidEmail(f.email)) {
            errors.email = isArabic ? "صيغة البريد الإلكتروني غير صالحة" : "Invalid email format";
        }

        if (!f.phone.trim()) {
            errors.phone = isArabic ? "هذا الحقل مطلوب" : "This field is required";
        } else if (!isValidSaudiPhone(f.phone)) {
            errors.phone = isArabic ? "صيغة رقم الهاتف غير صالحة" : "Invalid phone number format";
        }

        if (!f.password) {
            errors.password = isArabic ? "هذا الحقل مطلوب" : "This field is required";
        } else if (f.password.length < 6) {
            errors.password = isArabic ? "كلمة المرور يجب أن تكون 6 أحرف على الأقل" : "Password must be at least 6 characters";
        }

        if (!f.confirmPassword) {
            errors.confirmPassword = isArabic ? "هذا الحقل مطلوب" : "This field is required";
        } else if (f.password !== f.confirmPassword) {
            errors.confirmPassword = isArabic ? "كلمتا المرور غير متطابقتين" : "Passwords do not match";
        }

        if (!f.identityType) errors.identityType = isArabic ? "هذا الحقل مطلوب" : "This field is required";
        if (!f.identityNumber.trim()) errors.identityNumber = isArabic ? "هذا الحقل مطلوب" : "This field is required";
        if (!f.zoneId) errors.zoneId = isArabic ? "هذا الحقل مطلوب" : "This field is required";
        if (!f.vehicleId) errors.vehicleId = isArabic ? "هذا الحقل مطلوب" : "This field is required";
        if (!f.earning) errors.earning = isArabic ? "هذا الحقل مطلوب" : "This field is required";
        if (f.identityImages.length === 0) errors.identityImages = isArabic ? "هذا الحقل مطلوب" : "This field is required";
        if (!f.agreed) errors.agreed = isArabic ? "يجب الموافقة على الشروط وسياسة الخصوصية" : "You must agree to the terms and privacy policy";

        return Object.keys(errors).length > 0 ? errors : null;
    };

    const submit = useCallback(async (): Promise<JoinActionResult> => {
        if (submittingRef.current || isSubmitting) {
            return { success: false, message: "" };
        }

        const clientErrors = validate(form);
        if (clientErrors) {
            setFieldErrors(clientErrors);
            return {
                success: false,
                message: isArabic ? "هذا الحقل مطلوب" : "This field is required",
                fieldErrors: clientErrors,
            };
        }

        submittingRef.current = true;
        setIsSubmitting(true);
        setFieldErrors({});

        try {
            const {
                firstName, email, phone, password,
                identityType, identityNumber, zoneId, vehicleId, earning,
                identityImages, drivingLicenseImages, driverLicenseImages,
            } = form;

            const alreadyResult = await checkDriverRegistration({
                phone,
                email,
                identity_number: identityNumber,
            });
            if (alreadyResult.isRegistered) {
                return {
                    success: false,
                    alreadyRegistered: true,
                    message: alreadyResult.message ?? (isArabic ? "هذا الحساب مسجل مسبقاً" : "This account is already registered"),
                };
            }

            const result = await registerDriver({
                f_name: firstName.trim(),
                email: email.trim(),
                phone: phone.trim(),
                password,
                zone_id: zoneId,
                vehicle_id: vehicleId,
                earning: earning as EarningType,
                identity_type: identityType as IdentityType,
                identity_number: identityNumber.trim(),
                identity_images: identityImages,
                driving_license_images: drivingLicenseImages,
                driver_license_images: driverLicenseImages,
            });

            if (!result.success && result.fieldErrors) {
                setFieldErrors(result.fieldErrors);
            }

            return result;
        } finally {
            submittingRef.current = false;
            setIsSubmitting(false);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [form, isArabic, isSubmitting]);

    return {
        form,
        setField,
        zones,
        vehicles,
        isLoadingMeta,
        metaLoadError,
        retryMeta,
        isCheckingRegistration,
        isAlreadyRegistered,
        registrationCheckMsg,
        isSubmitting,
        fieldErrors,
        clearFieldError,
        handleAddFile,
        handleRemoveFile,
        submit,
    };
}

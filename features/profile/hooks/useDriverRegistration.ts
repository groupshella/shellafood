"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
    checkDriverRegistration,
    fetchVehicles,
    fetchZones,
    registerDriver,
} from "@/features/profile/actions/join.actions";
import { validateUploadFile } from "@/features/profile/lib/upload.lib";
import { JOIN_STRINGS, MAX_UPLOAD_BYTES } from "@/features/profile/constants/join.strings";
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
    const [form, setForm] = useState<DriverFormState>(INITIAL_FORM);
    const [zones, setZones] = useState<Zone[]>([]);
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [isLoadingMeta, setIsLoadingMeta] = useState(true);
    const [metaLoadError, setMetaLoadError] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [fieldErrors, setFieldErrors] = useState<Partial<Record<string, string>>>({});
    const submittingRef = useRef(false);
    const [metaRetryKey, setMetaRetryKey] = useState(0);

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
            if (err) return JOIN_STRINGS.fileTooLarge;
            setForm((prev) => ({ ...prev, [field]: [...prev[field], file] }));
            setFieldErrors((prev) => {
                if (!prev[field]) return prev;
                const next = { ...prev };
                delete next[field];
                return next;
            });
            return null;
        },
        [],
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

        if (!f.firstName.trim()) errors.firstName = JOIN_STRINGS.requiredField;

        if (!f.email.trim()) {
            errors.email = JOIN_STRINGS.requiredField;
        } else if (!isValidEmail(f.email)) {
            errors.email = JOIN_STRINGS.invalidEmail;
        }

        if (!f.phone.trim()) {
            errors.phone = JOIN_STRINGS.requiredField;
        } else if (!isValidSaudiPhone(f.phone)) {
            errors.phone = JOIN_STRINGS.invalidPhone;
        }

        if (!f.password) {
            errors.password = JOIN_STRINGS.requiredField;
        } else if (f.password.length < 6) {
            errors.password = JOIN_STRINGS.minPassword;
        }

        if (!f.confirmPassword) {
            errors.confirmPassword = JOIN_STRINGS.requiredField;
        } else if (f.password !== f.confirmPassword) {
            errors.confirmPassword = JOIN_STRINGS.passwordMismatch;
        }

        if (!f.identityType) errors.identityType = JOIN_STRINGS.requiredField;
        if (!f.identityNumber.trim()) errors.identityNumber = JOIN_STRINGS.requiredField;
        if (!f.zoneId) errors.zoneId = JOIN_STRINGS.requiredField;
        if (!f.vehicleId) errors.vehicleId = JOIN_STRINGS.requiredField;
        if (!f.earning) errors.earning = JOIN_STRINGS.requiredField;
        if (f.identityImages.length === 0) errors.identityImages = JOIN_STRINGS.requiredField;
        if (!f.agreed) errors.agreed = JOIN_STRINGS.mustAgreeTerms;

        return Object.keys(errors).length > 0 ? errors : null;
    };

    const submit = useCallback(async (): Promise<JoinActionResult> => {
        if (submittingRef.current || isSubmitting) {
            return { success: false, message: "" };
        }

        const clientErrors = validate(form);
        if (clientErrors) {
            setFieldErrors(clientErrors);
            return { success: false, message: JOIN_STRINGS.requiredField, fieldErrors: clientErrors };
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
                const msg = alreadyResult.message ?? JOIN_STRINGS.alreadyRegistered;
                setFieldErrors({ general: msg });
                return { success: false, message: msg };
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
    }, [form, isSubmitting]);

    return {
        form,
        setField,
        zones,
        vehicles,
        isLoadingMeta,
        metaLoadError,
        retryMeta,
        isSubmitting,
        fieldErrors,
        clearFieldError,
        handleAddFile,
        handleRemoveFile,
        submit,
    };
}

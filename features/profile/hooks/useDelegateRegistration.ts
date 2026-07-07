"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { fetchDelegateStatus, registerDelegate } from "@/features/profile/actions/join.actions";
import { validateUploadFile } from "@/features/profile/lib/upload.lib";
import { JOIN_STRINGS, MAX_UPLOAD_BYTES } from "@/features/profile/constants/join.strings";
import type { AuthUser } from "@/features/auth/types/auth.types";
import { COOKIE_KEYS } from "@/features/auth/types/auth.types";
import type { DelegateStatus, JoinActionResult } from "@/features/profile/types/join.types";

export interface DelegateFormState {
    firstName: string;
    lastName: string;
    mobile: string;
    idPhoto: File | null;
}

const INITIAL_FORM: DelegateFormState = {
    firstName: "",
    lastName: "",
    mobile: "",
    idPhoto: null,
};

/** Saudi phone: 9 digits, must start with 5 */
function isValidSaudiPhone(digits: string): boolean {
    return /^5\d{8}$/.test(digits.replace(/^\+966/, "").replace(/\D/g, ""));
}

export interface UseDelegateRegistrationReturn {
    form: DelegateFormState;
    setField: <K extends keyof DelegateFormState>(key: K, value: DelegateFormState[K]) => void;
    delegateStatus: DelegateStatus | null;
    isLoadingStatus: boolean;
    statusLoadError: boolean;
    isSubmitting: boolean;
    fieldErrors: Partial<Record<string, string>>;
    clearFieldError: (key: string) => void;
    setFieldError: (key: string, message: string) => void;
    handleSetPhoto: (file: File) => string | null;
    handleRemovePhoto: () => void;
    submit: () => Promise<JoinActionResult>;
}

function readAuthUser(): AuthUser | null {
    if (typeof document === "undefined") return null;
    try {
        const match = document.cookie.match(new RegExp(`(?:^|; )${COOKIE_KEYS.USER}=([^;]*)`));
        if (!match) return null;
        return JSON.parse(decodeURIComponent(match[1])) as AuthUser;
    } catch {
        return null;
    }
}

export function useDelegateRegistration(): UseDelegateRegistrationReturn {
    const [form, setFormState] = useState<DelegateFormState>(INITIAL_FORM);
    const [delegateStatus, setDelegateStatus] = useState<DelegateStatus | null>(null);
    const [isLoadingStatus, setIsLoadingStatus] = useState(true);
    const [statusLoadError, setStatusLoadError] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [fieldErrors, setFieldErrors] = useState<Partial<Record<string, string>>>({});
    const submittingRef = useRef(false);

    // Pre-fill name and phone from auth cookie
    useEffect(() => {
        const user = readAuthUser();
        if (user) {
            setFormState((prev) => ({
                ...prev,
                firstName: user.f_name ?? "",
                lastName: user.l_name ?? "",
                mobile: user.phone ?? "",
            }));
        }
    }, []);

    useEffect(() => {
        setIsLoadingStatus(true);
        setStatusLoadError(false);
        fetchDelegateStatus()
            .then((res) => setDelegateStatus(res.status))
            .catch(() => setStatusLoadError(true))
            .finally(() => setIsLoadingStatus(false));
    }, []);

    const setField = useCallback(
        <K extends keyof DelegateFormState>(key: K, value: DelegateFormState[K]) => {
            setFormState((prev) => ({ ...prev, [key]: value }));
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

    const setFieldError = useCallback((key: string, message: string) => {
        setFieldErrors((prev) => ({ ...prev, [key]: message }));
    }, []);

    const handleSetPhoto = useCallback((file: File): string | null => {
        const err = validateUploadFile(file, MAX_UPLOAD_BYTES);
        if (err) return JOIN_STRINGS.fileTooLarge;
        setFormState((prev) => ({ ...prev, idPhoto: file }));
        return null;
    }, []);

    const handleRemovePhoto = useCallback(() => {
        setFormState((prev) => ({ ...prev, idPhoto: null }));
    }, []);

    const validate = (f: DelegateFormState): Partial<Record<string, string>> | null => {
        const errors: Record<string, string> = {};

        if (!f.firstName.trim()) errors.firstName = JOIN_STRINGS.requiredField;
        if (!f.lastName.trim()) errors.lastName = JOIN_STRINGS.requiredField;

        if (!f.mobile.trim()) {
            errors.mobile = JOIN_STRINGS.requiredField;
        } else if (!isValidSaudiPhone(f.mobile)) {
            errors.mobile = JOIN_STRINGS.invalidPhone;
        }

        if (!f.idPhoto) errors.idPhoto = JOIN_STRINGS.requiredField;

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
            const user = readAuthUser();
            const result = await registerDelegate({
                user_id: String(user?.id ?? ""),
                f_name: form.firstName.trim(),
                l_name: form.lastName.trim(),
                mobile: form.mobile.trim(),
                id_photo: form.idPhoto!,
                id_photo_name: form.idPhoto!.name,
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
        delegateStatus,
        isLoadingStatus,
        statusLoadError,
        isSubmitting,
        fieldErrors,
        clearFieldError,
        setFieldError,
        handleSetPhoto,
        handleRemovePhoto,
        submit,
    };
}

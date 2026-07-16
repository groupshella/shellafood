"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
	fetchDelegateStatus,
	registerDelegate,
} from "@/features/profile/actions/join.actions";
import { validateUploadFile } from "@/features/profile/lib/upload.lib";
import { MAX_UPLOAD_BYTES } from "@/features/profile/constants/join.strings";
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

function isValidSaudiPhone(digits: string): boolean {
	return /^5\d{8}$/.test(digits.replace(/^\+966/, "").replace(/\D/g, ""));
}

export interface UseDelegateRegistrationReturn {
	form: DelegateFormState;
	setField: <K extends keyof DelegateFormState>(
		key: K,
		value: DelegateFormState[K],
	) => void;
	lockedFields: { firstName: boolean; lastName: boolean; mobile: boolean };
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
	isFormLocked: boolean;
}

function readAuthUser(): AuthUser | null {
	if (typeof document === "undefined") return null;
	try {
		const match = document.cookie.match(
			new RegExp(`(?:^|; )${COOKIE_KEYS.USER}=([^;]*)`),
		);
		if (!match) return null;
		return JSON.parse(decodeURIComponent(match[1])) as AuthUser;
	} catch {
		return null;
	}
}

export function useDelegateRegistration(
	lang: "ar" | "en" = "ar",
): UseDelegateRegistrationReturn {
	const isArabic = lang === "ar";
	const [form, setFormState] = useState<DelegateFormState>(INITIAL_FORM);
	const [lockedFields, setLockedFields] = useState({
		firstName: false,
		lastName: false,
		mobile: false,
	});
	const [delegateStatus, setDelegateStatus] = useState<DelegateStatus | null>(
		null,
	);
	const [isLoadingStatus, setIsLoadingStatus] = useState(true);
	const [statusLoadError, setStatusLoadError] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [fieldErrors, setFieldErrors] = useState<Partial<Record<string, string>>>(
		{},
	);
	const submittingRef = useRef(false);

	useEffect(() => {
		const user = readAuthUser();
		if (user) {
			const firstName = user.f_name ?? "";
			const lastName = user.l_name ?? "";
			const mobile = user.phone ?? "";
			setFormState((prev) => ({
				...prev,
				firstName,
				lastName,
				mobile,
			}));
			setLockedFields({
				firstName: Boolean(firstName.trim()),
				lastName: Boolean(lastName.trim()),
				mobile: Boolean(mobile.trim()),
			});
		}
	}, []);

	useEffect(() => {
		setIsLoadingStatus(true);
		setStatusLoadError(false);
		fetchDelegateStatus(lang)
			.then((res) => setDelegateStatus(res.status))
			.catch(() => setStatusLoadError(true))
			.finally(() => setIsLoadingStatus(false));
	}, [lang]);

	const setField = useCallback(
		<K extends keyof DelegateFormState>(
			key: K,
			value: DelegateFormState[K],
		) => {
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

	const handleSetPhoto = useCallback(
		(file: File): string | null => {
			const err = validateUploadFile(file, MAX_UPLOAD_BYTES);
			if (err) {
				return isArabic
					? "حجم الملف يجب ألا يتجاوز 2 ميجا"
					: "File size must not exceed 2MB";
			}
			setFormState((prev) => ({ ...prev, idPhoto: file }));
			return null;
		},
		[isArabic],
	);

	const handleRemovePhoto = useCallback(() => {
		setFormState((prev) => ({ ...prev, idPhoto: null }));
	}, []);

	const requiredMsg = isArabic ? "هذا الحقل مطلوب" : "This field is required";

	const validate = (
		f: DelegateFormState,
	): Partial<Record<string, string>> | null => {
		const errors: Record<string, string> = {};

		if (!f.firstName.trim()) errors.firstName = requiredMsg;
		if (!f.lastName.trim()) errors.lastName = requiredMsg;

		if (!f.mobile.trim()) {
			errors.mobile = requiredMsg;
		} else if (!isValidSaudiPhone(f.mobile)) {
			errors.mobile = isArabic
				? "صيغة رقم الهاتف غير صالحة"
				: "Invalid phone number format";
		}

		if (!f.idPhoto) errors.idPhoto = requiredMsg;

		return Object.keys(errors).length > 0 ? errors : null;
	};

	const isFormLocked =
		delegateStatus === "approved" || delegateStatus === "pending";

	const submit = useCallback(async (): Promise<JoinActionResult> => {
		const fillRequired = isArabic
			? "يرجى تعبئة الحقول المطلوبة"
			: "Please fill in the required fields";
		const alreadyRegistered = isArabic
			? "هذا الحساب مسجل مسبقاً"
			: "This account is already registered";
		const scrollToFix = isArabic
			? "يرجى تصحيح الحقول المشار إليها باللون الأحمر"
			: "Please fix the fields marked in red";

		if (submittingRef.current || isSubmitting || isFormLocked) {
			return {
				success: false,
				message: isFormLocked ? alreadyRegistered : "",
			};
		}

		const clientErrors = validate(form);
		if (clientErrors) {
			setFieldErrors({
				...clientErrors,
				general: fillRequired,
			});
			return {
				success: false,
				message: fillRequired,
				fieldErrors: clientErrors,
			};
		}

		submittingRef.current = true;
		setIsSubmitting(true);
		setFieldErrors({});

		try {
			const user = readAuthUser();
			const result = await registerDelegate(
				{
					user_id: String(user?.id ?? ""),
					f_name: form.firstName.trim(),
					l_name: form.lastName.trim(),
					mobile: form.mobile.trim(),
					id_photo: form.idPhoto!,
					id_photo_name: form.idPhoto!.name,
				},
				lang,
			);

			if (!result.success && result.fieldErrors) {
				setFieldErrors({
					...result.fieldErrors,
					general: result.message || scrollToFix,
				});
			}

			if (result.success) {
				setDelegateStatus("pending");
			}

			return result;
		} finally {
			submittingRef.current = false;
			setIsSubmitting(false);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [form, isSubmitting, isFormLocked, lang, isArabic]);

	return {
		form,
		setField,
		lockedFields,
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
		isFormLocked,
	};
}

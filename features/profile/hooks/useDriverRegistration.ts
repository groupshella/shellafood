"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
	checkDriverRegistration,
	fetchVehicles,
	fetchZones,
	registerDriver,
} from "@/features/profile/actions/join.actions";
import { validateUploadFile } from "@/features/profile/lib/upload.lib";
import { MAX_UPLOAD_BYTES } from "@/features/profile/constants/join.strings";
import { isValidEmail } from "@/features/profile/lib/profile.lib";
import type { AuthUser } from "@/features/auth/types/auth.types";
import { COOKIE_KEYS } from "@/features/auth/types/auth.types";
import type {
	EarningType,
	IdentityType,
	JoinActionResult,
	JoinRegistrationState,
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

export interface DriverLockedFields {
	firstName: boolean;
	email: boolean;
	phone: boolean;
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

function isValidSaudiPhone(digits: string): boolean {
	return /^5\d{8}$/.test(digits.replace(/^\+966/, "").replace(/\D/g, ""));
}

function localizeApiMessage(message: string, isArabic: boolean): string {
	if (message.trim() === "messages.validation.password.letters") {
		return isArabic
			? "كلمة المرور يجب أن تحتوي على حرف واحد على الأقل"
			: "Password must contain at least one letter";
	}
	return message;
}

function localizeFieldErrors(
	fieldErrors: Partial<Record<string, string>>,
	isArabic: boolean,
): Partial<Record<string, string>> {
	const localized: Record<string, string> = {};
	for (const [field, message] of Object.entries(fieldErrors)) {
		if (message) localized[field] = localizeApiMessage(message, isArabic);
	}
	return localized;
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

export interface UseDriverRegistrationReturn {
	form: DriverFormState;
	setField: <K extends keyof DriverFormState>(
		key: K,
		value: DriverFormState[K],
	) => void;
	lockedFields: DriverLockedFields;
	registrationStatus: JoinRegistrationState | null;
	isLoadingStatus: boolean;
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
	isFormLocked: boolean;
}

export function useDriverRegistration(
	lang: "ar" | "en" = "ar",
): UseDriverRegistrationReturn {
	const isArabic = lang === "ar";
	const [form, setForm] = useState<DriverFormState>(INITIAL_FORM);
	const [lockedFields, setLockedFields] = useState<DriverLockedFields>({
		firstName: false,
		email: false,
		phone: false,
	});
	const [registrationStatus, setRegistrationStatus] =
		useState<JoinRegistrationState | null>(null);
	const [isLoadingStatus, setIsLoadingStatus] = useState(true);
	const [zones, setZones] = useState<Zone[]>([]);
	const [vehicles, setVehicles] = useState<Vehicle[]>([]);
	const [isLoadingMeta, setIsLoadingMeta] = useState(true);
	const [metaLoadError, setMetaLoadError] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [fieldErrors, setFieldErrors] = useState<Partial<Record<string, string>>>(
		{},
	);
	const submittingRef = useRef(false);
	const [metaRetryKey, setMetaRetryKey] = useState(0);

	useEffect(() => {
		const user = readAuthUser();
		if (!user) return;

		const firstName = user.f_name?.trim() ?? "";
		const email = user.email?.trim() ?? "";
		const phone = user.phone?.trim() ?? "";

		setForm((prev) => ({
			...prev,
			firstName: firstName || prev.firstName,
			lastName: user.l_name?.trim() || prev.lastName,
			email: email || prev.email,
			phone: phone || prev.phone,
		}));

		setLockedFields({
			firstName: Boolean(firstName),
			email: Boolean(email),
			phone: Boolean(phone),
		});
	}, []);

	useEffect(() => {
		setIsLoadingStatus(true);
		const user = readAuthUser();
		checkDriverRegistration(
			{
				phone: user?.phone || undefined,
				email: user?.email || undefined,
			},
			lang,
		)
			.then((res) => setRegistrationStatus(res.status))
			.catch(() => setRegistrationStatus("none"))
			.finally(() => setIsLoadingStatus(false));
	}, [lang]);

	useEffect(() => {
		setIsLoadingMeta(true);
		setMetaLoadError(false);
		Promise.all([fetchZones(lang), fetchVehicles(lang)])
			.then(([z, v]) => {
				setZones(z);
				setVehicles(v);
				if (z.length === 0 && v.length === 0) setMetaLoadError(true);
			})
			.catch(() => setMetaLoadError(true))
			.finally(() => setIsLoadingMeta(false));
	}, [metaRetryKey, lang]);

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

	const requiredMsg = isArabic ? "هذا الحقل مطلوب" : "This field is required";

	const handleAddFile = useCallback(
		(
			field: "identityImages" | "drivingLicenseImages" | "driverLicenseImages",
			file: File,
		): string | null => {
			const err = validateUploadFile(file, MAX_UPLOAD_BYTES);
			if (err) {
				return isArabic
					? "حجم الملف يجب ألا يتجاوز 2 ميجا"
					: "File size must not exceed 2MB";
			}
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

		if (!f.firstName.trim()) errors.firstName = requiredMsg;

		if (!f.email.trim()) {
			errors.email = requiredMsg;
		} else if (!isValidEmail(f.email)) {
			errors.email = isArabic
				? "صيغة البريد الإلكتروني غير صالحة"
				: "Invalid email format";
		}

		if (!f.phone.trim()) {
			errors.phone = requiredMsg;
		} else if (!isValidSaudiPhone(f.phone)) {
			errors.phone = isArabic
				? "صيغة رقم الهاتف غير صالحة"
				: "Invalid phone number format";
		}

		if (!f.password) {
			errors.password = requiredMsg;
		} else if (f.password.length < 6) {
			errors.password = isArabic
				? "كلمة المرور يجب أن تكون 6 أحرف على الأقل"
				: "Password must be at least 6 characters";
		} else if (!/\p{L}/u.test(f.password)) {
			errors.password = isArabic
				? "كلمة المرور يجب أن تحتوي على حرف واحد على الأقل"
				: "Password must contain at least one letter";
		}

		if (!f.confirmPassword) {
			errors.confirmPassword = requiredMsg;
		} else if (f.password !== f.confirmPassword) {
			errors.confirmPassword = isArabic
				? "كلمتا المرور غير متطابقتين"
				: "Passwords do not match";
		}

		if (!f.identityType) errors.identityType = requiredMsg;
		if (!f.identityNumber.trim()) errors.identityNumber = requiredMsg;
		if (!f.zoneId) errors.zoneId = requiredMsg;
		if (!f.vehicleId) errors.vehicleId = requiredMsg;
		if (!f.earning) errors.earning = requiredMsg;
		if (f.identityImages.length === 0) errors.identityImages = requiredMsg;
		if (!f.agreed) {
			errors.agreed = isArabic
				? "يجب الموافقة على الشروط وسياسة الخصوصية"
				: "You must agree to the terms and privacy policy";
		}

		return Object.keys(errors).length > 0 ? errors : null;
	};

	const isFormLocked =
		registrationStatus === "registered" ||
		registrationStatus === "approved" ||
		registrationStatus === "active" ||
		registrationStatus === "pending";

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
			const {
				firstName,
				email,
				phone,
				password,
				identityType,
				identityNumber,
				zoneId,
				vehicleId,
				earning,
				identityImages,
				drivingLicenseImages,
				driverLicenseImages,
			} = form;

			const result = await registerDriver(
				{
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
				},
				lang,
			);

			if (!result.success && result.fieldErrors) {
				const localized = localizeFieldErrors(result.fieldErrors, isArabic);
				setFieldErrors({
					...localized,
					general:
						localizeApiMessage(result.message || "", isArabic) ||
						localized.general ||
						scrollToFix,
				});
			}

			if (result.success) {
				setRegistrationStatus("pending");
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
		registrationStatus,
		isLoadingStatus,
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
		isFormLocked,
	};
}

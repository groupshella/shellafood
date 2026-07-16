"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, Plus } from "lucide-react";
import type { AuthUser, UserGender } from "@/features/auth/types/auth.types";
import { ProfileSubpageShell } from "@/features/profile/components/ProfileSubpageShell";
import { PrimaryButton } from "@/features/profile/components/shared/PrimaryButton";
import { ProfileAvatar } from "@/features/profile/components/shared/ProfileAvatar";
import { ProfilePhotoCrop } from "@/features/profile/components/shared/ProfilePhotoCrop";
import { ProfileRadioRow } from "@/features/profile/components/shared/ProfileRadioRow";
import { useProfileEdit } from "@/features/profile/context/ProfileEditContext";
import { updateProfile } from "@/features/profile/actions/profile.actions";
import { cropProfileImage } from "@/features/profile/lib/crop-image";
import {
	footerAboveNavClass,
	inputClassName,
	RequiredMark,
} from "@/features/profile/components/shared/registration/formTokens";
import { PhoneField } from "@/features/profile/components/shared/registration/PhoneInput";
import { isValidEmail } from "@/features/profile/lib/profile.lib";
import type { ProfileFieldErrors } from "@/features/profile/types/profile.types";

function hasProfileChanges(
	draft: { fullName: string; email: string; pendingPhotoFile: File | null },
	user: AuthUser,
): boolean {
	const userFullName = `${user.f_name} ${user.l_name}`.trim() || user.name?.trim() || "";
	return (
		draft.fullName.trim() !== userFullName ||
		draft.email.trim() !== (user.email ?? "").trim() ||
		draft.pendingPhotoFile instanceof File
	);
}

function getUserDisplayName(user: AuthUser): string {
	return `${user.f_name} ${user.l_name}`.trim() || user.name?.trim() || "";
}

function genderLabel(gender: UserGender | null | undefined, isArabic: boolean): string {
	if (gender === "male") return isArabic ? "ذكر" : "Male";
	if (gender === "female") return isArabic ? "أنثى" : "Female";
	return isArabic ? "اختار الجنس" : "Select gender";
}

type EditView = "form" | "gender" | "photo";

const MAX_PHOTO_BYTES = 5 * 1024 * 1024;
const ACCEPTED_PHOTO_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

interface EditProfileClientProps {
	user: AuthUser;
	isArabic: boolean;
}

function fieldInputClass(hasError: boolean) {
	return [
		inputClassName,
		hasError ? "border-red-500 focus:border-red-500/60 focus:ring-red-500/10" : "",
	].join(" ");
}

function FieldError({ message }: { message?: string }) {
	if (!message) return null;
	return (
		<p
			className="w-full text-start text-[12px] font-medium leading-[160%] text-red-500"
			role="alert"
		>
			{message}
		</p>
	);
}

function FieldBlock({
	label,
	hint,
	required,
	error,
	children,
}: {
	label: string;
	hint?: string;
	required?: boolean;
	error?: string;
	children: React.ReactNode;
}) {
	return (
		<div className="flex w-full flex-col items-start gap-1.5">
			{hint ? (
				<div className="flex items-center justify-start gap-1">
					<span className="text-[14px] font-bold leading-[160%] text-foreground">
						{label}
					</span>
					<span className="text-[12px] font-medium leading-[160%] text-muted">
						{hint}
					</span>
				</div>
			) : (
				<div className="flex items-center justify-start gap-1">
					<span className="text-[14px] font-bold leading-[160%] text-foreground">
						{label}
					</span>
					{required && <RequiredMark />}
				</div>
			)}
			{children}
			<FieldError message={error} />
		</div>
	);
}

export function EditProfileClient({ user, isArabic }: EditProfileClientProps) {
	const router = useRouter();
	const lang = isArabic ? "ar" : "en";
	const fileInputRef = useRef<HTMLInputElement>(null);
	const savingRef = useRef(false);
	const {
		draft,
		setFullName,
		setEmail,
		setGender,
		setImagePreview,
		setPendingPhotoFile,
		resetFromUser,
	} = useProfileEdit();

	const [view, setView] = useState<EditView>("form");
	const [isSaving, setIsSaving] = useState(false);
	const [fieldErrors, setFieldErrors] = useState<ProfileFieldErrors>({});
	const [genderSelection, setGenderSelection] = useState<UserGender>(
		draft.gender ?? "male",
	);
	const [photoSrc, setPhotoSrc] = useState<string | null>(null);
	const [zoom, setZoom] = useState(1.2);

	const clearFieldError = (field: keyof ProfileFieldErrors) => {
		setFieldErrors((prev) => {
			if (!prev[field]) return prev;
			const next = { ...prev };
			delete next[field];
			return next;
		});
	};

	const goToForm = () => {
		setFieldErrors({});
		setPhotoSrc(null);
		setZoom(1.2);
		setView("form");
	};

	const validateForm = (): ProfileFieldErrors | null => {
		const errors: ProfileFieldErrors = {};
		const name = draft.fullName.trim();
		const email = draft.email.trim();

		if (!name) {
			errors.name = isArabic ? "يرجى إدخال الاسم" : "Please enter your name";
		}

		if (!email) {
			errors.email = isArabic ? "هذا الحقل مطلوب" : "This field is required";
		} else if (!isValidEmail(email)) {
			errors.email = isArabic
				? "يرجى إدخال بريد إلكتروني صحيح"
				: "Please enter a valid email";
		}

		if (!user.phone?.trim()) {
			errors.phone = isArabic
				? "رقم الهاتف غير متوفر في حسابك"
				: "Phone number is missing from your account";
		}

		return Object.keys(errors).length > 0 ? errors : null;
	};

	const handlePhotoPick = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		event.target.value = "";
		if (!file) return;

		if (!ACCEPTED_PHOTO_TYPES.has(file.type) || file.size > MAX_PHOTO_BYTES) {
			setFieldErrors({
				image: isArabic
					? "يرجى اختيار صورة JPG أو PNG بحجم أقل من 5 ميجابايت"
					: "Please choose a JPG or PNG under 5MB",
			});
			return;
		}

		clearFieldError("image");
		const reader = new FileReader();
		reader.onload = () => {
			setPhotoSrc(reader.result as string);
			setZoom(1.2);
			setView("photo");
		};
		reader.readAsDataURL(file);
	};

	const handleSaveForm = async () => {
		if (savingRef.current || isSaving) return;

		const clientErrors = validateForm();
		if (clientErrors) {
			setFieldErrors(clientErrors);
			return;
		}

		if (!hasProfileChanges(draft, user)) {
			router.back();
			return;
		}

		savingRef.current = true;
		setIsSaving(true);
		setFieldErrors({});

		try {
			const photoFile =
				draft.pendingPhotoFile instanceof File ? draft.pendingPhotoFile : null;

			const result = await updateProfile(
				{
					name: draft.fullName.trim(),
					email: draft.email.trim(),
					phone: user.phone.trim(),
				},
				photoFile,
				lang,
			);

			if (!result.success) {
				setFieldErrors(result.fieldErrors ?? { general: result.message });
				return;
			}

			if (result.user) {
				resetFromUser(result.user);
			}

			setPendingPhotoFile(null);
			router.refresh();
			router.back();
		} finally {
			savingRef.current = false;
			setIsSaving(false);
		}
	};

	const handleSaveGender = () => {
		setGender(genderSelection);
		goToForm();
	};

	const handleSavePhoto = async () => {
		if (!photoSrc) return;

		setIsSaving(true);
		clearFieldError("image");

		try {
			const blob = await cropProfileImage(photoSrc, zoom, 0, 0);
			const file = new File([blob], "profile.jpg", { type: "image/jpeg" });
			const preview = URL.createObjectURL(blob);

			setPendingPhotoFile(file);
			setImagePreview(preview);
			goToForm();
		} catch {
			setFieldErrors({
				image: isArabic
					? "تعذر حفظ التغييرات، حاول مرة أخرى"
					: "Could not save changes. Please try again",
			});
		} finally {
			setIsSaving(false);
		}
	};

	const openGender = () => {
		setGenderSelection(draft.gender ?? "male");
		setView("gender");
	};

	const saveLabel = isArabic ? "حفظ" : "Save";

	const shellConfig = {
		form: {
			title: isArabic ? "إعدادات الحساب" : "Account settings",
			footer: (
				<PrimaryButton
					onClick={handleSaveForm}
					disabled={isSaving}
					className="h-12 rounded-xl py-3 text-[16px] font-bold"
				>
					{isSaving
						? isArabic
							? "جاري الحفظ..."
							: "Saving..."
						: saveLabel}
				</PrimaryButton>
			),
			onBack: undefined,
		},
		gender: {
			title: isArabic ? "تحديد الجنس" : "Select gender",
			footer: (
				<PrimaryButton
					onClick={handleSaveGender}
					className="h-12 rounded-xl py-3 text-[16px] font-bold"
				>
					{saveLabel}
				</PrimaryButton>
			),
			onBack: goToForm,
		},
		photo: {
			title: isArabic ? "صورة الملف الشخصي" : "Profile photo",
			footer: (
				<PrimaryButton
					onClick={handleSavePhoto}
					disabled={isSaving}
					className="h-12 rounded-xl py-3 text-[16px] font-bold"
				>
					{saveLabel}
				</PrimaryButton>
			),
			onBack: goToForm,
		},
	}[view];

	const generalError = fieldErrors.general;

	return (
		<ProfileSubpageShell
			title={shellConfig.title}
			footer={shellConfig.footer}
			onBack={shellConfig.onBack}
			relaxedHeader
			showHeaderBorder={false}
			showFooterBorder={false}
			footerClassName={footerAboveNavClass}
			mainClassName="pb-36"
			isArabic={isArabic}
		>
			{view === "form" && (
				<div className="mx-auto grid w-full max-w-lg grid-cols-1 gap-4 sm:max-w-2xl md:grid-cols-2 lg:max-w-3xl lg:gap-5">
					{generalError && (
						<div
							className="rounded-xl bg-red-500/10 px-3 py-2.5 text-center text-[13px] font-medium leading-relaxed text-red-500 md:col-span-2"
							role="alert"
						>
							{generalError}
						</div>
					)}

					<div className="flex flex-col items-center gap-1.5 py-2 md:col-span-2">
						<button
							type="button"
							onClick={() => fileInputRef.current?.click()}
							className="group relative rounded-full transition-transform active:scale-[0.98]"
							aria-label={
								isArabic
									? "تغيير صورة الملف الشخصي"
									: "Change profile photo"
							}
						>
							<ProfileAvatar
								src={draft.imagePreview}
								alt={draft.fullName || getUserDisplayName(user)}
								size={100}
								className={[
									"border",
									fieldErrors.image ? "border-red-500" : "border-border",
								].join(" ")}
							/>
							<span className="absolute bottom-0 end-0 flex h-[18px] w-[18px] items-center justify-center rounded-full bg-brand text-brand-foreground shadow-sm ring-2 ring-background transition-colors group-hover:brightness-95">
								<Plus className="h-3 w-3" strokeWidth={1.5} />
							</span>
						</button>
						<FieldError message={fieldErrors.image} />
						<input
							ref={fileInputRef}
							type="file"
							accept="image/jpeg,image/png,image/webp"
							className="hidden"
							onChange={handlePhotoPick}
						/>
					</div>

					<FieldBlock
						label={isArabic ? "الاسم" : "Name"}
						required
						error={fieldErrors.name}
					>
						<input
							type="text"
							value={draft.fullName}
							onChange={(e) => {
								setFullName(e.target.value);
								clearFieldError("name");
								clearFieldError("general");
							}}
							className={`${fieldInputClass(Boolean(fieldErrors.name))} text-start`}
							dir={isArabic ? "rtl" : "ltr"}
							autoComplete="name"
							aria-required
							aria-invalid={Boolean(fieldErrors.name)}
						/>
					</FieldBlock>

					<FieldBlock
						label={isArabic ? "البريد الالكتروني" : "Email"}
						required
						error={fieldErrors.email}
					>
						<input
							type="email"
							value={draft.email}
							onChange={(e) => {
								setEmail(e.target.value);
								clearFieldError("email");
								clearFieldError("general");
							}}
							className={`${fieldInputClass(Boolean(fieldErrors.email))} text-end`}
							dir="ltr"
							autoComplete="email"
							aria-required
							aria-invalid={Boolean(fieldErrors.email)}
						/>
					</FieldBlock>

					<FieldBlock
						label={isArabic ? "رقم الهاتف" : "Phone number"}
						hint={
							isArabic ? "(غير قابل للتعديل)" : "(not editable)"
						}
						error={fieldErrors.phone}
					>
						<PhoneField value={user.phone} readOnly />
					</FieldBlock>

					<FieldBlock label={isArabic ? "الجنس" : "Gender"}>
						<button
							type="button"
							onClick={openGender}
							className={`${inputClassName} justify-between`}
						>
							<span
								className={`text-[14px] font-medium leading-[160%] ${
									draft.gender ? "text-foreground" : "text-muted"
								}`}
							>
								{genderLabel(draft.gender, isArabic)}
							</span>
							<ChevronLeft
								className={`h-5 w-5 shrink-0 text-muted ${
									isArabic ? "" : "rotate-180"
								}`}
								strokeWidth={1.5}
							/>
						</button>
					</FieldBlock>

					<Link
						href="/profile/delete-account"
						className="flex min-h-[50px] w-full items-center justify-center rounded-xl bg-card px-4 text-[16px] font-bold leading-[160%] text-red-500 transition-colors active:opacity-80 md:col-span-2"
					>
						{isArabic ? "حذف الحساب" : "Delete account"}
					</Link>
				</div>
			)}

			{view === "gender" && (
				<div className="mx-auto flex w-full max-w-lg flex-col gap-6 sm:max-w-2xl lg:max-w-3xl">
					<div className="rounded-2xl bg-background px-3 sm:px-4">
						<h2 className="text-[16px] font-bold text-foreground">
							{isArabic ? "اختر جنسك" : "Choose your gender"}
						</h2>
						<p className="mt-2 text-[14px] leading-relaxed text-muted">
							{isArabic
								? "نستخدم هذه المعلومة لتحسين تجربتك داخل التطبيق."
								: "We use this to improve your experience in the app."}
						</p>
					</div>
					<div>
						<ProfileRadioRow
							label={isArabic ? "ذكر" : "Male"}
							selected={genderSelection === "male"}
							onSelect={() => setGenderSelection("male")}
						/>
						<ProfileRadioRow
							label={isArabic ? "أنثى" : "Female"}
							selected={genderSelection === "female"}
							onSelect={() => setGenderSelection("female")}
						/>
					</div>
				</div>
			)}

			{view === "photo" && photoSrc && (
				<div className="mx-auto w-full max-w-lg sm:max-w-2xl lg:max-w-3xl">
					<ProfilePhotoCrop
						photoSrc={photoSrc}
						zoom={zoom}
						onZoomChange={setZoom}
						error={fieldErrors.image ?? null}
						isArabic={isArabic}
					/>
				</div>
			)}
		</ProfileSubpageShell>
	);
}

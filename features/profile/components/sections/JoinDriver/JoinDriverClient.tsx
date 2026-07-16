"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, RefreshCw } from "lucide-react";
import { JoinSuccessModal } from "@/features/profile/components/modals/JoinSuccessModal";
import { ProfileSubpageShell } from "@/features/profile/components/ProfileSubpageShell";
import { PrimaryButton } from "@/features/profile/components/shared/PrimaryButton";
import {
	FormField,
	footerAboveNavClass,
	formContainerClass,
	inputClassName,
	sectionTitleClass,
} from "@/features/profile/components/shared/registration/FormField";
import {
	FileUploadZone,
	TermsCheckbox,
} from "@/features/profile/components/shared/registration/FileUploadZone";
import { FormAlert } from "@/features/profile/components/shared/registration/FormAlert";
import { PasswordInput } from "@/features/profile/components/shared/registration/PasswordInput";
import { PhoneField } from "@/features/profile/components/shared/registration/PhoneInput";
import { useDriverRegistration } from "@/features/profile/hooks/useDriverRegistration";
import { scrollToFirstFormIssue } from "@/features/profile/lib/scroll-to-form-issue";
import type { JoinRegistrationState } from "@/features/profile/types/join.types";

const buttonShadow = "shadow-[0_4px_14px_rgba(48,145,63,0.22)]";
const disabledInputClass = "cursor-not-allowed bg-card opacity-80";

function FieldError({ message, id }: { message?: string; id?: string }) {
	if (!message) return null;
	return (
		<p
			id={id}
			role="alert"
			aria-live="polite"
			className="mt-1 text-[12px] font-medium text-red-500"
		>
			{message}
		</p>
	);
}

function driverStatusBanner(
	status: JoinRegistrationState | null,
	isArabic: boolean,
): { tone: "success" | "warning" | "info"; message: string } | null {
	if (!status || status === "none" || status === "rejected") return null;
	if (status === "pending") {
		return {
			tone: "warning",
			message: isArabic
				? "طلب انضمامك كرجل توصيل قيد المراجعة."
				: "Your delivery driver application is under review.",
		};
	}
	if (status === "active") {
		return {
			tone: "success",
			message: isArabic
				? "حسابك كرجل توصيل نشط."
				: "Your delivery driver account is active.",
		};
	}
	return {
		tone: "success",
		message: isArabic
			? "أنت مسجّل مسبقاً كرجل توصيل. لا يمكن إرسال طلب جديد."
			: "You are already registered as a delivery driver. A new request cannot be submitted.",
	};
}

interface SelectOption<T extends string> {
	value: T;
	label: string;
}

function SelectDropdown<T extends string>({
	label,
	value,
	options,
	onChange,
	placeholder,
	required,
	error,
	fieldId,
	disabled,
}: {
	label: string;
	value: T | "";
	options: SelectOption<T>[];
	onChange: (v: T) => void;
	placeholder: string;
	required?: boolean;
	error?: string;
	fieldId?: string;
	disabled?: boolean;
}) {
	const [open, setOpen] = useState(false);
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!open) return;
		const handler = (e: MouseEvent) => {
			if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
		};
		document.addEventListener("mousedown", handler);
		return () => document.removeEventListener("mousedown", handler);
	}, [open]);

	const selected = options.find((o) => o.value === value);
	const errorId = fieldId ? `${fieldId}-error` : undefined;

	return (
		<FormField label={label} required={required}>
			<div
				ref={ref}
				className="relative"
				id={fieldId}
				data-error={error ? "true" : undefined}
			>
				<button
					type="button"
					onClick={() => !disabled && setOpen((p) => !p)}
					disabled={disabled}
					aria-haspopup="listbox"
					aria-expanded={open}
					aria-describedby={error ? errorId : undefined}
					aria-invalid={!!error}
					className={`${inputClassName} justify-between text-start ${
						error
							? "border-red-500 focus:border-red-500 focus:ring-red-500/10"
							: ""
					} ${disabled ? disabledInputClass : ""}`}
				>
					<span
						className={
							selected ? "font-medium text-foreground" : "text-muted"
						}
					>
						{selected?.label ?? placeholder}
					</span>
					<ChevronDown
						className={`h-5 w-5 shrink-0 text-muted transition-transform ${
							open ? "rotate-180" : ""
						}`}
						strokeWidth={1.5}
					/>
				</button>

				{open && options.length > 0 && (
					<ul
						role="listbox"
						className="absolute inset-x-0 top-[calc(100%+6px)] z-20 max-h-52 overflow-y-auto rounded-2xl border border-border bg-card shadow-[0_8px_30px_rgba(0,0,0,0.08)]"
					>
						{options.map((opt, idx) => (
							<li key={opt.value} role="option" aria-selected={value === opt.value}>
								<button
									type="button"
									onClick={() => {
										onChange(opt.value);
										setOpen(false);
									}}
									className={`w-full px-4 py-3.5 text-start text-[14px] transition-colors active:bg-background ${
										value === opt.value
											? "font-semibold text-brand"
											: "text-foreground"
									} ${idx > 0 ? "border-t border-border" : ""}`}
								>
									{opt.label}
								</button>
							</li>
						))}
					</ul>
				)}
			</div>
			<FieldError message={error} id={errorId} />
		</FormField>
	);
}

function MultiFileSection({
	label,
	files,
	onAdd,
	onRemove,
	error,
	fieldId,
	disabled,
	addTitle,
	isArabic,
}: {
	label: string;
	files: File[];
	onAdd: (file: File) => void;
	onRemove: (index: number) => void;
	error?: string;
	fieldId?: string;
	disabled?: boolean;
	addTitle: string;
	isArabic: boolean;
}) {
	return (
		<div
			className="flex flex-col gap-2"
			id={fieldId}
			data-error={error ? "true" : undefined}
			aria-invalid={!!error}
		>
			<h3 className={sectionTitleClass}>{label}</h3>
			{files.map((f, i) => (
				<FileUploadZone
					key={`${f.name}-${i}`}
					title={f.name}
					uploaded={{ file: f, previewName: f.name }}
					onSelect={onAdd}
					onRemove={() => onRemove(i)}
					isArabic={isArabic}
				/>
			))}
			{!disabled && (
				<FileUploadZone
					title={addTitle}
					uploaded={null}
					onSelect={onAdd}
					onRemove={() => {}}
					isArabic={isArabic}
				/>
			)}
			<FieldError message={error} />
		</div>
	);
}

const EARNING_OPTIONS = [
	{
		value: "0" as const,
		label: { ar: "مستقل (Freelancer)", en: "Freelancer" },
	},
	{
		value: "1" as const,
		label: { ar: "براتب (Salary)", en: "Salary" },
	},
] as const;

const IDENTITY_TYPE_OPTIONS = [
	{
		value: "passport" as const,
		label: { ar: "جواز سفر", en: "Passport" },
	},
	{
		value: "driving_license" as const,
		label: { ar: "رخصة قيادة", en: "Driving license" },
	},
] as const;

export function JoinDriverClient({ isArabic }: { isArabic: boolean }) {
	const router = useRouter();
	const lang = isArabic ? "ar" : "en";
	const [showSuccess, setShowSuccess] = useState(false);
	const formRef = useRef<HTMLDivElement>(null);

	const earningOptions = EARNING_OPTIONS.map((o) => ({
		value: o.value,
		label: isArabic ? o.label.ar : o.label.en,
	}));

	const identityTypeOptions = IDENTITY_TYPE_OPTIONS.map((o) => ({
		value: o.value,
		label: isArabic ? o.label.ar : o.label.en,
	}));

	const {
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
	} = useDriverRegistration(lang);

	const handleSubmit = async () => {
		const result = await submit();
		if (result.success) {
			setShowSuccess(true);
		} else {
			scrollToFirstFormIssue(formRef.current);
		}
	};

	const handleSuccessClose = () => {
		setShowSuccess(false);
		router.replace("/profile");
	};

	const zoneOptions = zones.map((z) => ({ value: String(z.id), label: z.name }));
	const vehicleOptions = vehicles.map((v) => ({
		value: String(v.id),
		label: v.type,
	}));
	const statusBanner = driverStatusBanner(registrationStatus, isArabic);
	const fieldsDisabled = isFormLocked || isSubmitting;
	const loadingLabel = isArabic ? "جاري التحميل..." : "Loading...";
	const addIdPhoto = isArabic
		? "أضف صورة للهوية الشخصية"
		: "Add an ID photo";

	return (
		<>
			<ProfileSubpageShell
				title={
					isArabic ? "انضم كرجل توصيل" : "Join as a delivery driver"
				}
				subtitle={
					isArabic
						? "خطوات بسيطة لتكون بمثابة رجل التسليم"
						: "Simple steps to become a delivery driver"
				}
				subtitleAlign="start"
				relaxedHeader
				showHeaderBorder={false}
				showFooterBorder={false}
				footerClassName={footerAboveNavClass}
				mainClassName="pb-36"
				isArabic={isArabic}
				footer={
					<PrimaryButton
						onClick={handleSubmit}
						disabled={
							isSubmitting ||
							isLoadingMeta ||
							isLoadingStatus ||
							isFormLocked
						}
						className={`h-12 rounded-xl py-3 text-[16px] font-bold ${buttonShadow}`}
					>
						{isSubmitting
							? isArabic
								? "جاري الإرسال..."
								: "Submitting..."
							: isArabic
								? "ارسال"
								: "Submit"}
					</PrimaryButton>
				}
			>
				<div
					ref={formRef}
					className={`${formContainerClass} gap-5 pb-2 xl:max-w-4xl`}
				>
					{statusBanner && (
						<FormAlert
							tone={statusBanner.tone}
							message={statusBanner.message}
							role="status"
							className="md:col-span-2"
						/>
					)}

					{metaLoadError && !isLoadingMeta && (
						<FormAlert
							tone="warning"
							message={
								isArabic
									? "تعذر تحميل البيانات. اضغط لإعادة المحاولة"
									: "Could not load data. Tap to retry"
							}
							className="md:col-span-2"
							action={
								<button
									type="button"
									onClick={retryMeta}
									className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-[12px] font-semibold text-amber-700 transition-colors active:bg-amber-500/10"
									aria-label={isArabic ? "إعادة المحاولة" : "Retry"}
								>
									<RefreshCw className="h-3.5 w-3.5" />
									{isArabic ? "إعادة" : "Retry"}
								</button>
							}
						/>
					)}

					{fieldErrors.general && (
						<FormAlert
							tone="error"
							message={fieldErrors.general}
							className="md:col-span-2"
						/>
					)}

					<FormField
						label={isArabic ? "الاسم الأول" : "First name"}
						required
					>
						<input
							type="text"
							id="field-firstName"
							value={form.firstName}
							onChange={(e) => {
								setField("firstName", e.target.value);
								clearFieldError("firstName");
							}}
							placeholder={isArabic ? "الاسم الأول" : "First name"}
							disabled={fieldsDisabled || lockedFields.firstName}
							className={`${inputClassName} text-start ${
								fieldErrors.firstName
									? "border-red-500 focus:border-red-500 focus:ring-red-500/10"
									: ""
							} ${lockedFields.firstName || fieldsDisabled ? disabledInputClass : ""}`}
							dir={isArabic ? "rtl" : "ltr"}
							autoComplete="given-name"
							aria-required
							aria-invalid={!!fieldErrors.firstName}
							aria-describedby={
								fieldErrors.firstName ? "err-firstName" : undefined
							}
						/>
						<FieldError message={fieldErrors.firstName} id="err-firstName" />
					</FormField>

					<FormField
						label={isArabic ? "البريد الالكتروني" : "Email"}
						required
					>
						<input
							type="email"
							inputMode="email"
							id="field-email"
							value={form.email}
							onChange={(e) => {
								setField("email", e.target.value);
								clearFieldError("email");
							}}
							placeholder={isArabic ? "البريد الالكتروني" : "Email"}
							disabled={fieldsDisabled || lockedFields.email}
							className={`${inputClassName} text-start ${
								fieldErrors.email
									? "border-red-500 focus:border-red-500 focus:ring-red-500/10"
									: ""
							} ${lockedFields.email || fieldsDisabled ? disabledInputClass : ""}`}
							dir="ltr"
							autoComplete="email"
							aria-required
							aria-invalid={!!fieldErrors.email}
							aria-describedby={fieldErrors.email ? "err-email" : undefined}
						/>
						<FieldError message={fieldErrors.email} id="err-email" />
					</FormField>

					<FormField
						label={isArabic ? "رقم الهاتف" : "Phone number"}
						required
					>
						<div
							aria-invalid={!!fieldErrors.phone}
							data-error={fieldErrors.phone ? "true" : undefined}
							className={
								fieldErrors.phone ? "rounded-xl ring-1 ring-red-500" : ""
							}
						>
							<PhoneField
								value={form.phone}
								onChange={
									fieldsDisabled || lockedFields.phone
										? undefined
										: (v) => {
												setField("phone", v);
												clearFieldError("phone");
											}
								}
								placeholder="5x xxx xxxx"
								readOnly={fieldsDisabled || lockedFields.phone}
							/>
						</div>
						<FieldError message={fieldErrors.phone} id="err-phone" />
					</FormField>

					<FormField
						label={isArabic ? "كلمة المرور" : "Password"}
						required
					>
						<PasswordInput
							value={form.password}
							onChange={(v) => {
								setField("password", v);
								clearFieldError("password");
							}}
							placeholder={isArabic ? "كلمة المرور" : "Password"}
							hasError={!!fieldErrors.password}
							disabled={fieldsDisabled}
							isArabic={isArabic}
						/>
						<FieldError message={fieldErrors.password} id="err-password" />
					</FormField>

					<FormField
						label={isArabic ? "تأكيد كلمة المرور" : "Confirm password"}
						required
					>
						<PasswordInput
							value={form.confirmPassword}
							onChange={(v) => {
								setField("confirmPassword", v);
								clearFieldError("confirmPassword");
							}}
							placeholder={
								isArabic ? "تأكيد كلمة المرور" : "Confirm password"
							}
							hasError={!!fieldErrors.confirmPassword}
							disabled={fieldsDisabled}
							isArabic={isArabic}
						/>
						<FieldError
							message={fieldErrors.confirmPassword}
							id="err-confirmPassword"
						/>
					</FormField>

					<section id="identity-section" className="scroll-mt-4 md:col-span-2">
						<h2 className={sectionTitleClass}>
							{isArabic ? "الهوية الشخصية" : "Personal ID"}
						</h2>
						<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
							<SelectDropdown
								label={isArabic ? "اختر نوع الهوية" : "Choose ID type"}
								value={form.identityType}
								options={identityTypeOptions}
								onChange={(v) => {
									setField("identityType", v);
									clearFieldError("identityType");
								}}
								placeholder={
									isArabic ? "اختر نوع الهوية" : "Choose ID type"
								}
								required
								error={fieldErrors.identityType}
								fieldId="field-identityType"
								disabled={fieldsDisabled}
							/>

							<FormField
								label={isArabic ? "رقم الهوية" : "ID number"}
								required
							>
								<input
									type="text"
									inputMode="numeric"
									id="field-identityNumber"
									value={form.identityNumber}
									onChange={(e) => {
										setField("identityNumber", e.target.value);
										clearFieldError("identityNumber");
									}}
									placeholder={
										isArabic ? "أدخل رقم الهوية" : "Enter ID number"
									}
									disabled={fieldsDisabled}
									className={`${inputClassName} text-start ${
										fieldErrors.identityNumber
											? "border-red-500 focus:border-red-500 focus:ring-red-500/10"
											: ""
									} ${fieldsDisabled ? disabledInputClass : ""}`}
									dir={isArabic ? "rtl" : "ltr"}
									aria-required
									aria-invalid={!!fieldErrors.identityNumber}
									aria-describedby={
										fieldErrors.identityNumber
											? "err-identityNumber"
											: undefined
									}
								/>
								<FieldError
									message={fieldErrors.identityNumber}
									id="err-identityNumber"
								/>
							</FormField>

							<MultiFileSection
								label={isArabic ? "صور الهوية" : "ID photos"}
								files={form.identityImages}
								onAdd={(f) => handleAddFile("identityImages", f)}
								onRemove={(i) => handleRemoveFile("identityImages", i)}
								error={fieldErrors.identityImages}
								fieldId="field-identityImages"
								disabled={fieldsDisabled}
								addTitle={addIdPhoto}
								isArabic={isArabic}
							/>

							<MultiFileSection
								label={
									isArabic ? "صور رخصة المركبة" : "Vehicle license photos"
								}
								files={form.drivingLicenseImages}
								onAdd={(f) => handleAddFile("drivingLicenseImages", f)}
								onRemove={(i) =>
									handleRemoveFile("drivingLicenseImages", i)
								}
								error={fieldErrors.drivingLicenseImages}
								disabled={fieldsDisabled}
								addTitle={addIdPhoto}
								isArabic={isArabic}
							/>

							<MultiFileSection
								label={
									isArabic ? "صور رخصة القيادة" : "Driving license photos"
								}
								files={form.driverLicenseImages}
								onAdd={(f) => handleAddFile("driverLicenseImages", f)}
								onRemove={(i) => handleRemoveFile("driverLicenseImages", i)}
								error={fieldErrors.driverLicenseImages}
								disabled={fieldsDisabled}
								addTitle={addIdPhoto}
								isArabic={isArabic}
							/>
						</div>
					</section>

					<section id="work-section" className="scroll-mt-4 md:col-span-2">
						<h2 className={sectionTitleClass}>
							{isArabic ? "تفاصيل العمل" : "Work details"}
						</h2>
						<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
							<SelectDropdown
								label={isArabic ? "اختر العنوان" : "Choose address"}
								value={form.zoneId}
								options={zoneOptions}
								onChange={(v) => {
									setField("zoneId", v);
									clearFieldError("zoneId");
								}}
								placeholder={
									isLoadingMeta
										? loadingLabel
										: isArabic
											? "اختر العنوان"
											: "Choose address"
								}
								required
								error={fieldErrors.zoneId}
								fieldId="field-zoneId"
								disabled={isLoadingMeta || fieldsDisabled}
							/>

							<SelectDropdown
								label={
									isArabic ? "اختر وسيلة التوصيل" : "Choose delivery method"
								}
								value={form.vehicleId}
								options={vehicleOptions}
								onChange={(v) => {
									setField("vehicleId", v);
									clearFieldError("vehicleId");
								}}
								placeholder={
									isLoadingMeta
										? loadingLabel
										: isArabic
											? "اختر وسيلة التوصيل"
											: "Choose delivery method"
								}
								required
								error={fieldErrors.vehicleId}
								fieldId="field-vehicleId"
								disabled={isLoadingMeta || fieldsDisabled}
							/>

							<SelectDropdown
								label={isArabic ? "اختر نوع العمل" : "Choose work type"}
								value={form.earning}
								options={earningOptions}
								onChange={(v) => {
									setField("earning", v);
									clearFieldError("earning");
								}}
								placeholder={
									isArabic ? "اختر نوع العمل" : "Choose work type"
								}
								required
								error={fieldErrors.earning}
								fieldId="field-earning"
								disabled={fieldsDisabled}
							/>
						</div>
					</section>

					<div
						className="md:col-span-2"
						data-error={fieldErrors.agreed ? "true" : undefined}
					>
						<TermsCheckbox
							checked={form.agreed}
							onChange={(v) => {
								setField("agreed", v);
								clearFieldError("agreed");
							}}
							isArabic={isArabic}
						/>
						<FieldError message={fieldErrors.agreed} />
					</div>
				</div>
			</ProfileSubpageShell>

			<JoinSuccessModal
				isOpen={showSuccess}
				onClose={handleSuccessClose}
				isArabic={isArabic}
			/>
		</>
	);
}

"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
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
import { FileUploadZone } from "@/features/profile/components/shared/registration/FileUploadZone";
import { FormAlert } from "@/features/profile/components/shared/registration/FormAlert";
import { PhoneField } from "@/features/profile/components/shared/registration/PhoneInput";
import { useDelegateRegistration } from "@/features/profile/hooks/useDelegateRegistration";
import { scrollToFirstFormIssue } from "@/features/profile/lib/scroll-to-form-issue";

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

export function JoinVoucherRepClient({ isArabic }: { isArabic: boolean }) {
	const router = useRouter();
	const lang = isArabic ? "ar" : "en";
	const [showSuccess, setShowSuccess] = useState(false);
	const formRef = useRef<HTMLDivElement>(null);

	const {
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
	} = useDelegateRegistration(lang);

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

	const statusBanner =
		!isLoadingStatus && delegateStatus && delegateStatus !== "none"
			? {
					pending: {
						tone: "warning" as const,
						message: isArabic
							? "طلبك قيد المراجعة، سيتم التواصل معك قريباً."
							: "Your request is under review. We will contact you soon.",
					},
					approved: {
						tone: "success" as const,
						message: isArabic
							? "تم قبول طلبك كمندوب تسويق. مرحباً بك!"
							: "Your marketing rep application was approved. Welcome!",
					},
					rejected: {
						tone: "error" as const,
						message: isArabic
							? "تم رفض طلبك. يمكنك إعادة التقديم."
							: "Your request was rejected. You can apply again.",
					},
				}[delegateStatus]
			: null;

	const fieldsDisabled = isFormLocked || isSubmitting;

	return (
		<>
			<ProfileSubpageShell
				title={
					isArabic ? "انضم كمندوب تسويق" : "Join as a marketing rep"
				}
				subtitle={
					isArabic
						? "خطوات بسيطة لتصبح مندوب تسويق قسائم شرائية"
						: "Simple steps to become a voucher marketing representative"
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
						disabled={isSubmitting || isLoadingStatus || isFormLocked}
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

					{statusLoadError && !isLoadingStatus && (
						<FormAlert
							tone="info"
							message={
								isArabic
									? "تعذر التحقق من حالة الطلب. يمكنك المتابعة بإرسال الطلب."
									: "Could not verify request status. You can still submit."
							}
							role="status"
							className="md:col-span-2"
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
							} ${
								lockedFields.firstName || fieldsDisabled
									? disabledInputClass
									: ""
							}`}
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
						label={isArabic ? "اسم العائلة" : "Last name"}
						required
					>
						<input
							type="text"
							value={form.lastName}
							onChange={(e) => {
								setField("lastName", e.target.value);
								clearFieldError("lastName");
							}}
							placeholder={isArabic ? "اسم العائلة" : "Last name"}
							disabled={fieldsDisabled || lockedFields.lastName}
							className={`${inputClassName} text-start ${
								fieldErrors.lastName
									? "border-red-500 focus:border-red-500 focus:ring-red-500/10"
									: ""
							} ${
								lockedFields.lastName || fieldsDisabled
									? disabledInputClass
									: ""
							}`}
							dir={isArabic ? "rtl" : "ltr"}
							autoComplete="family-name"
							aria-required
							aria-invalid={!!fieldErrors.lastName}
							aria-describedby={
								fieldErrors.lastName ? "err-lastName" : undefined
							}
						/>
						<FieldError message={fieldErrors.lastName} id="err-lastName" />
					</FormField>

					<FormField
						label={isArabic ? "رقم الهاتف" : "Phone number"}
						required
					>
						<div
							aria-invalid={!!fieldErrors.mobile}
							data-error={fieldErrors.mobile ? "true" : undefined}
							className={
								fieldErrors.mobile ? "rounded-xl ring-1 ring-red-500" : ""
							}
						>
							<PhoneField
								value={form.mobile}
								onChange={
									fieldsDisabled || lockedFields.mobile
										? undefined
										: (v) => {
												setField("mobile", v);
												clearFieldError("mobile");
											}
								}
								placeholder="5x xxx xxxx"
								readOnly={fieldsDisabled || lockedFields.mobile}
							/>
						</div>
						<FieldError message={fieldErrors.mobile} id="err-mobile" />
					</FormField>

					<section className="md:col-span-2">
						<h2 className={sectionTitleClass}>
							{isArabic ? "المستندات" : "Documents"}
						</h2>
						<p className="mb-3 text-[13px] font-medium leading-relaxed text-muted">
							{isArabic
								? "يرجى رفع صورة الهوية أو عقد الإيجار، مع التأكد من وضوح المستند وكتابة اسم الملف بشكل صحيح."
								: "Please upload an ID photo or lease agreement. Make sure the document is clear and the file is named correctly."}
						</p>
						<div
							data-error={fieldErrors.idPhoto ? "true" : undefined}
							aria-invalid={!!fieldErrors.idPhoto}
						>
							<FileUploadZone
								title={isArabic ? "اختر ملفاً وأضفه" : "Choose a file"}
								isArabic={isArabic}
								uploaded={
									form.idPhoto
										? {
												file: form.idPhoto,
												previewName: form.idPhoto.name,
											}
										: null
								}
								onSelect={(file) => {
									if (fieldsDisabled) return;
									const err = handleSetPhoto(file);
									if (err) {
										setFieldError("idPhoto", err);
									} else {
										clearFieldError("idPhoto");
									}
								}}
								onRemove={() => {
									if (fieldsDisabled) return;
									handleRemovePhoto();
									clearFieldError("idPhoto");
								}}
								accept="image/*,.pdf"
								variant="document"
							/>
						</div>
						<FieldError message={fieldErrors.idPhoto} id="err-idPhoto" />
					</section>
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

"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { AlertCircle } from "lucide-react";
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
import { PhoneField } from "@/features/profile/components/shared/registration/PhoneInput";
import { JOIN_STRINGS } from "@/features/profile/constants/join.strings";
import { useDelegateRegistration } from "@/features/profile/hooks/useDelegateRegistration";

const buttonShadow = "shadow-[0_4px_14px_rgba(48,145,63,0.22)]";

// ── Inline field error ────────────────────────────────────────────────────────
function FieldError({ message, id }: { message?: string; id?: string }) {
    if (!message) return null;
    return (
        <p id={id} role="alert" aria-live="polite" className="mt-1 text-[12px] font-medium text-[#DB2626] dark:text-red-400">
            {message}
        </p>
    );
}

// ── Status banners ────────────────────────────────────────────────────────────
const DELEGATE_STATUS_BANNERS = {
    pending: {
        bg: "bg-[#FFF8E1] border-amber-200 dark:bg-amber-950/30 dark:border-amber-800/50",
        text: "text-amber-800 dark:text-amber-200",
        icon: "text-amber-600 dark:text-amber-400",
        message: "طلبك قيد المراجعة، سيتم التواصل معك قريباً.",
    },
    approved: {
        bg: "bg-[#E8F5E9] border-[#30913F]/30 dark:bg-[#30913F]/10 dark:border-[#30913F]/40",
        text: "text-[#1B5E20] dark:text-[#4db860]",
        icon: "text-[#30913F] dark:text-[#4db860]",
        message: "تم قبول طلبك كمندوب تسويق. مرحباً بك!",
    },
    rejected: {
        bg: "bg-[#FFEBEE] border-[#DB2626]/30 dark:bg-red-950/30 dark:border-red-900/40",
        text: "text-[#DB2626] dark:text-red-400",
        icon: "text-[#DB2626] dark:text-red-400",
        message: "تم رفض طلبك. يمكنك إعادة التقديم.",
    },
} as const;

export function JoinVoucherRepClient() {
    const router = useRouter();
    const [showSuccess, setShowSuccess] = useState(false);
    const formRef = useRef<HTMLDivElement>(null);

    const {
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
    } = useDelegateRegistration();

    const scrollToFirstError = () => {
        requestAnimationFrame(() => {
            const firstError = formRef.current?.querySelector("[aria-invalid='true']");
            if (firstError) firstError.scrollIntoView({ behavior: "smooth", block: "center" });
        });
    };

    const handleSubmit = async () => {
        const result = await submit();
        if (result.success) {
            setShowSuccess(true);
        } else {
            scrollToFirstError();
        }
    };

    const handleSuccessClose = () => {
        setShowSuccess(false);
        router.replace("/profile");
    };

    const statusBanner =
        !isLoadingStatus && delegateStatus && delegateStatus !== "none"
            ? DELEGATE_STATUS_BANNERS[delegateStatus]
            : null;

    const isFormDisabled = delegateStatus === "approved" || delegateStatus === "pending";

    return (
        <>
            <ProfileSubpageShell
                title={JOIN_STRINGS.voucherTitle}
                subtitle={JOIN_STRINGS.voucherSubtitle}
                subtitleAlign="start"
                relaxedHeader
                showHeaderBorder={false}
                showFooterBorder={false}
                footerClassName={footerAboveNavClass}
                mainClassName="pb-36"
                footer={
                    <PrimaryButton
                        onClick={handleSubmit}
                        disabled={isSubmitting || isLoadingStatus || isFormDisabled}
                        className={`h-12 rounded-xl py-3 text-[16px] font-bold ${buttonShadow}`}
                    >
                        {isSubmitting ? "جاري الإرسال..." : JOIN_STRINGS.send}
                    </PrimaryButton>
                }
            >
                <div ref={formRef} className={`${formContainerClass} pb-2`}>

                    {/* ── Delegate status banner ── */}
                    {statusBanner && (
                        <div
                            role="status"
                            aria-live="polite"
                            className={`flex items-start gap-2 rounded-xl border px-4 py-3 md:col-span-2 ${statusBanner.bg}`}
                        >
                            <AlertCircle className={`mt-0.5 h-4 w-4 shrink-0 ${statusBanner.icon}`} />
                            <p className={`text-[13px] font-medium ${statusBanner.text}`}>
                                {statusBanner.message}
                            </p>
                        </div>
                    )}

                    {/* ── Status load error (non-blocking) ── */}
                    {statusLoadError && !isLoadingStatus && (
                        <div
                            role="status"
                            aria-live="polite"
                            className="flex items-start gap-2 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-700 dark:bg-gray-800/50 md:col-span-2"
                        >
                            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-gray-500 dark:text-gray-400" />
                            <p className="text-[13px] font-medium text-gray-600 dark:text-gray-400">
                                تعذر التحقق من حالة الطلب. يمكنك المتابعة بإرسال الطلب.
                            </p>
                        </div>
                    )}

                    {/* ── General error banner ── */}
                    {fieldErrors.general && (
                        <div
                            role="alert"
                            aria-live="assertive"
                            className="flex items-start gap-2 rounded-xl border border-[#DB2626]/20 bg-[#DB2626]/5 px-4 py-3 dark:border-red-900/40 dark:bg-red-950/20 md:col-span-2"
                        >
                            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-[#DB2626] dark:text-red-400" />
                            <p className="text-[13px] font-medium text-[#DB2626] dark:text-red-400">
                                {fieldErrors.general}
                            </p>
                        </div>
                    )}

                    {/* ── First name ── */}
                    <FormField label={JOIN_STRINGS.firstName} required>
                        <input
                            type="text"
                            value={form.firstName}
                            onChange={(e) => { setField("firstName", e.target.value); clearFieldError("firstName"); }}
                            placeholder={JOIN_STRINGS.firstName}
                            className={`${inputClassName} text-start ${fieldErrors.firstName ? "border-[#DB2626] focus:border-[#DB2626] focus:ring-red-100" : ""}`}
                            dir="rtl"
                            autoComplete="given-name"
                            aria-required
                            aria-invalid={!!fieldErrors.firstName}
                            aria-describedby={fieldErrors.firstName ? "err-firstName" : undefined}
                        />
                        <FieldError message={fieldErrors.firstName} id="err-firstName" />
                    </FormField>

                    {/* ── Last name ── */}
                    <FormField label={JOIN_STRINGS.lastName} required>
                        <input
                            type="text"
                            value={form.lastName}
                            onChange={(e) => { setField("lastName", e.target.value); clearFieldError("lastName"); }}
                            placeholder={JOIN_STRINGS.lastName}
                            className={`${inputClassName} text-start ${fieldErrors.lastName ? "border-[#DB2626] focus:border-[#DB2626] focus:ring-red-100" : ""}`}
                            dir="rtl"
                            autoComplete="family-name"
                            aria-required
                            aria-invalid={!!fieldErrors.lastName}
                            aria-describedby={fieldErrors.lastName ? "err-lastName" : undefined}
                        />
                        <FieldError message={fieldErrors.lastName} id="err-lastName" />
                    </FormField>

                    {/* ── Phone ── */}
                    <FormField label={JOIN_STRINGS.phone} required>
                        <div
                            aria-invalid={!!fieldErrors.mobile}
                            className={fieldErrors.mobile ? "rounded-xl ring-1 ring-[#DB2626]" : ""}
                        >
                            <PhoneField
                                value={form.mobile}
                                onChange={(v) => { setField("mobile", v); clearFieldError("mobile"); }}
                                placeholder="5x xxx xxxx"
                            />
                        </div>
                        <FieldError message={fieldErrors.mobile} id="err-mobile" />
                    </FormField>

                    {/* ── ID photo ── */}
                    <section className="md:col-span-2">
                        <h2 className={sectionTitleClass}>{JOIN_STRINGS.documents}</h2>
                        <p className="mb-3 text-[13px] font-medium leading-relaxed text-[#555555] dark:text-gray-400">
                            {JOIN_STRINGS.documentsDesc}
                        </p>
                        <FileUploadZone
                            title={JOIN_STRINGS.chooseFile}
                            uploaded={form.idPhoto ? { file: form.idPhoto, previewName: form.idPhoto.name } : null}
                            onSelect={(file) => {
                                const err = handleSetPhoto(file);
                                if (err) {
                                    setFieldError("idPhoto", err);
                                } else {
                                    clearFieldError("idPhoto");
                                }
                            }}
                            onRemove={() => {
                                handleRemovePhoto();
                                clearFieldError("idPhoto");
                            }}
                            accept="image/*,.pdf"
                            variant="document"
                        />
                        {fieldErrors.idPhoto && (
                            <div
                                aria-invalid
                                className="mt-1"
                            >
                                <FieldError message={fieldErrors.idPhoto} id="err-idPhoto" />
                            </div>
                        )}
                    </section>
                </div>
            </ProfileSubpageShell>

            <JoinSuccessModal isOpen={showSuccess} onClose={handleSuccessClose} />
        </>
    );
}

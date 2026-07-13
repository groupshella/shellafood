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
import { JOIN_STRINGS } from "@/features/profile/constants/join.strings";
import { useDelegateRegistration } from "@/features/profile/hooks/useDelegateRegistration";
import { scrollToFirstFormIssue } from "@/features/profile/lib/scroll-to-form-issue";

const buttonShadow = "shadow-[0_4px_14px_rgba(48,145,63,0.22)]";
const disabledInputClass =
    "cursor-not-allowed bg-gray-50 opacity-80 dark:bg-gray-800/60";

function FieldError({ message, id }: { message?: string; id?: string }) {
    if (!message) return null;
    return (
        <p
            id={id}
            role="alert"
            aria-live="polite"
            className="mt-1 text-[12px] font-medium text-[#DB2626] dark:text-red-400"
        >
            {message}
        </p>
    );
}

const DELEGATE_STATUS_BANNERS = {
    pending: {
        tone: "warning" as const,
        message: "طلبك قيد المراجعة، سيتم التواصل معك قريباً.",
    },
    approved: {
        tone: "success" as const,
        message: "تم قبول طلبك كمندوب تسويق. مرحباً بك!",
    },
    rejected: {
        tone: "error" as const,
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
    } = useDelegateRegistration();

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
            ? DELEGATE_STATUS_BANNERS[delegateStatus]
            : null;

    const fieldsDisabled = isFormLocked || isSubmitting;

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
                        disabled={
                            isSubmitting || isLoadingStatus || isFormLocked
                        }
                        className={`h-12 rounded-xl py-3 text-[16px] font-bold ${buttonShadow}`}
                    >
                        {isSubmitting ? JOIN_STRINGS.submitting : JOIN_STRINGS.send}
                    </PrimaryButton>
                }
            >
                <div ref={formRef} className={`${formContainerClass} pb-2`}>
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
                            message="تعذر التحقق من حالة الطلب. يمكنك المتابعة بإرسال الطلب."
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

                    <FormField label={JOIN_STRINGS.firstName} required>
                        <input
                            type="text"
                            value={form.firstName}
                            onChange={(e) => {
                                setField("firstName", e.target.value);
                                clearFieldError("firstName");
                            }}
                            placeholder={JOIN_STRINGS.firstName}
                            disabled={fieldsDisabled || lockedFields.firstName}
                            className={`${inputClassName} text-start ${
                                fieldErrors.firstName
                                    ? "border-[#DB2626] focus:border-[#DB2626] focus:ring-red-100"
                                    : ""
                            } ${
                                lockedFields.firstName || fieldsDisabled
                                    ? disabledInputClass
                                    : ""
                            }`}
                            dir="rtl"
                            autoComplete="given-name"
                            aria-required
                            aria-invalid={!!fieldErrors.firstName}
                            aria-describedby={
                                fieldErrors.firstName ? "err-firstName" : undefined
                            }
                        />
                        <FieldError message={fieldErrors.firstName} id="err-firstName" />
                    </FormField>

                    <FormField label={JOIN_STRINGS.lastName} required>
                        <input
                            type="text"
                            value={form.lastName}
                            onChange={(e) => {
                                setField("lastName", e.target.value);
                                clearFieldError("lastName");
                            }}
                            placeholder={JOIN_STRINGS.lastName}
                            disabled={fieldsDisabled || lockedFields.lastName}
                            className={`${inputClassName} text-start ${
                                fieldErrors.lastName
                                    ? "border-[#DB2626] focus:border-[#DB2626] focus:ring-red-100"
                                    : ""
                            } ${
                                lockedFields.lastName || fieldsDisabled
                                    ? disabledInputClass
                                    : ""
                            }`}
                            dir="rtl"
                            autoComplete="family-name"
                            aria-required
                            aria-invalid={!!fieldErrors.lastName}
                            aria-describedby={
                                fieldErrors.lastName ? "err-lastName" : undefined
                            }
                        />
                        <FieldError message={fieldErrors.lastName} id="err-lastName" />
                    </FormField>

                    <FormField label={JOIN_STRINGS.phone} required>
                        <div
                            aria-invalid={!!fieldErrors.mobile}
                            data-error={fieldErrors.mobile ? "true" : undefined}
                            className={
                                fieldErrors.mobile ? "rounded-xl ring-1 ring-[#DB2626]" : ""
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
                        <h2 className={sectionTitleClass}>{JOIN_STRINGS.documents}</h2>
                        <p className="mb-3 text-[13px] font-medium leading-relaxed text-[#555555] dark:text-gray-400">
                            {JOIN_STRINGS.documentsDesc}
                        </p>
                        <div
                            data-error={fieldErrors.idPhoto ? "true" : undefined}
                            aria-invalid={!!fieldErrors.idPhoto}
                        >
                            <FileUploadZone
                                title={JOIN_STRINGS.chooseFile}
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

            <JoinSuccessModal isOpen={showSuccess} onClose={handleSuccessClose} />
        </>
    );
}

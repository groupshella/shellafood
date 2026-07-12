"use client";

import { useRouter } from "next/navigation";
import { useRef, useState, useEffect } from "react";
import { AlertCircle } from "lucide-react";
import { JoinSuccessModal } from "@/features/profile/components/modals/JoinSuccessModal";
import { JoinAlreadyRegisteredModal } from "@/features/profile/components/modals/JoinAlreadyRegisteredModal";
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
import { useLanguage } from "@/features/language/useLanguage";
import { useDelegateRegistration } from "@/features/profile/hooks/useDelegateRegistration";

const buttonShadow = "shadow-[0_4px_14px_rgba(48,145,63,0.22)]";

// ── Inline field error ────────────────────────────────────────────────────────
function FieldError({ message, id }: { message?: string; id?: string }) {
    const { isArabic } = useLanguage();
    if (!message) return null;
    return (
        <p id={id} role="alert" aria-live="polite" className="mt-1 text-[12px] font-medium text-[#DB2626] dark:text-red-400">
            {isArabic
                ? message
                : message === "حجم الملف يجب ألا يتجاوز 2 ميجا"
                    ? "File size must not exceed 2 MB"
                    : message === "هذا الحقل مطلوب"
                        ? "This field is required"
                        : message === "كلمتا المرور غير متطابقتين"
                            ? "Passwords do not match"
                            : message === "يجب الموافقة على الشروط وسياسة الخصوصية"
                                ? "You must agree to the terms and privacy policy"
                                : message === "صيغة رقم الهاتف غير صالحة"
                                    ? "Invalid phone number"
                                    : message === "صيغة البريد الإلكتروني غير صالحة"
                                        ? "Invalid email address"
                                        : message === "كلمة المرور يجب أن تكون 6 أحرف على الأقل"
                                            ? "Password must be at least 6 characters"
                                            : message === "هذا الحساب مسجل مسبقاً"
                                                ? "This account is already registered"
                                                : message === "تعذر تحميل البيانات. اضغط لإعادة المحاولة"
                                                    ? "Could not load data. Tap to retry"
                                                    : message === "تعذر الاتصال بالخادم، تحقق من اتصالك وحاول مرة أخرى"
                                                        ? "Could not connect to the server. Check your connection and try again"
                                                        : message}
        </p>
    );
}

// ── Status banners ────────────────────────────────────────────────────────────
const DELEGATE_STATUS_BANNERS = {
    pending: {
        bg: "bg-[#FFF8E1] border-amber-200 dark:bg-amber-950/30 dark:border-amber-800/50",
        text: "text-amber-800 dark:text-amber-200",
        icon: "text-amber-600 dark:text-amber-400",
        message: { ar: "طلبك قيد المراجعة، سيتم التواصل معك قريباً.", en: "Your request is under review. We will contact you soon." },
    },
    approved: {
        bg: "bg-[#E8F5E9] border-[#30913F]/30 dark:bg-[#30913F]/10 dark:border-[#30913F]/40",
        text: "text-[#1B5E20] dark:text-[#4db860]",
        icon: "text-[#30913F] dark:text-[#4db860]",
        message: { ar: "تم قبول طلبك كمندوب تسويق. مرحباً بك!", en: "Your marketing rep request was approved. Welcome!" },
    },
    rejected: {
        bg: "bg-[#FFEBEE] border-[#DB2626]/30 dark:bg-red-950/30 dark:border-red-900/40",
        text: "text-[#DB2626] dark:text-red-400",
        icon: "text-[#DB2626] dark:text-red-400",
        message: { ar: "تم رفض طلبك. يمكنك إعادة التقديم.", en: "Your request was rejected. You can apply again." },
    },
} as const;

export function JoinVoucherRepClient() {
    const router = useRouter();
    const { isArabic } = useLanguage();
    const [showSuccess, setShowSuccess] = useState(false);
    const [showAlreadyRegistered, setShowAlreadyRegistered] = useState(false);
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

    useEffect(() => {
        if (!isLoadingStatus && (delegateStatus === "pending" || delegateStatus === "approved")) {
            setShowAlreadyRegistered(true);
        }
    }, [delegateStatus, isLoadingStatus]);

    // Scroll to the first invalid field whenever errors are set or updated.
    // setTimeout(0) ensures React has committed the DOM update before querying.
    const prevErrorCountRef = useRef(0);
    useEffect(() => {
        const count = Object.keys(fieldErrors).length;
        if (count > prevErrorCountRef.current) {
            setTimeout(() => {
                const el = formRef.current?.querySelector("[aria-invalid='true'], [data-error='true']");
                el?.scrollIntoView({ behavior: "smooth", block: "center" });
            }, 0);
        }
        prevErrorCountRef.current = count;
    }, [fieldErrors]);

    const handleSubmit = async () => {
        const result = await submit();
        if (result.success) {
            setShowSuccess(true);
        }
        // Scroll is handled automatically by the fieldErrors useEffect above
    };

    const handleSuccessClose = () => {
        setShowSuccess(false);
        router.replace("/profile");
    };

    const statusBanner =
        !isLoadingStatus && delegateStatus && delegateStatus !== "none"
            ? DELEGATE_STATUS_BANNERS[delegateStatus]
            : null;

    const alreadyRegisteredMsg =
        delegateStatus === "approved"
            ? (isArabic ? "تم قبولك كمندوب تسويق. مرحباً بك!" : "You have been accepted as a marketing rep. Welcome!")
            : (isArabic ? "طلبك قيد المراجعة، سيتم التواصل معك قريباً." : "Your request is under review. We will contact you soon.");

    const isFormDisabled = delegateStatus === "approved" || delegateStatus === "pending";

    return (
        <>
            <ProfileSubpageShell
                title={isArabic ? "انضم كمندوب تسويق" : "Join as a marketing rep"}
                subtitle={isArabic ? "خطوات بسيطة لتصبح مندوب تسويق قسائم شرائية" : "Simple steps to become a voucher marketing rep"}
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
                        {isSubmitting ? (isArabic ? "جاري الإرسال..." : "Submitting...") : isArabic ? "ارسال" : "Submit"}
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
                                {isArabic ? statusBanner.message.ar : statusBanner.message.en}
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
                                {isArabic ? "تعذر التحقق من حالة الطلب. يمكنك المتابعة بإرسال الطلب." : "Could not verify the request status. You can continue submitting the request."}
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
                                {isArabic
                                    ? fieldErrors.general
                                    : fieldErrors.general === "تعذر الاتصال بالخادم، تحقق من اتصالك وحاول مرة أخرى"
                                        ? "Could not connect to the server. Check your connection and try again"
                                        : fieldErrors.general === "هذا الحساب مسجل مسبقاً"
                                            ? "This account is already registered"
                                            : fieldErrors.general}
                            </p>
                        </div>
                    )}

                    {/* ── First name ── */}
                    <FormField label={isArabic ? "الاسم الأول" : "First name"} required>
                        <input
                            type="text"
                            value={form.firstName}
                            onChange={(e) => { setField("firstName", e.target.value); clearFieldError("firstName"); }}
                            placeholder={isArabic ? "الاسم الأول" : "First name"}
                            className={`${inputClassName} text-start ${fieldErrors.firstName ? "border-[#DB2626] focus:border-[#DB2626] focus:ring-red-100" : ""}`}
                            dir={isArabic ? "rtl" : "ltr"}
                            autoComplete="given-name"
                            aria-required
                            aria-invalid={!!fieldErrors.firstName}
                            aria-describedby={fieldErrors.firstName ? "err-firstName" : undefined}
                        />
                        <FieldError message={fieldErrors.firstName} id="err-firstName" />
                    </FormField>

                    {/* ── Last name ── */}
                    <FormField label={isArabic ? "اسم العائلة" : "Last name"} required>
                        <input
                            type="text"
                            value={form.lastName}
                            onChange={(e) => { setField("lastName", e.target.value); clearFieldError("lastName"); }}
                            placeholder={isArabic ? "اسم العائلة" : "Last name"}
                            className={`${inputClassName} text-start ${fieldErrors.lastName ? "border-[#DB2626] focus:border-[#DB2626] focus:ring-red-100" : ""}`}
                            dir={isArabic ? "rtl" : "ltr"}
                            autoComplete="family-name"
                            aria-required
                            aria-invalid={!!fieldErrors.lastName}
                            aria-describedby={fieldErrors.lastName ? "err-lastName" : undefined}
                        />
                        <FieldError message={fieldErrors.lastName} id="err-lastName" />
                    </FormField>

                    {/* ── Phone ── */}
                    <FormField label={isArabic ? "رقم الهاتف" : "Phone number"} required>
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
                    <section className="md:col-span-2" data-error={!!fieldErrors.idPhoto || undefined}>
                        <h2 className={sectionTitleClass}>{isArabic ? "المستندات" : "Documents"}</h2>
                        <p className="mb-3 text-[13px] font-medium leading-relaxed text-[#555555] dark:text-gray-400">
                            {isArabic ? "يرجى رفع صورة الهوية أو عقد الإيجار، مع التأكد من وضوح المستند وكتابة اسم الملف بشكل صحيح." : "Please upload an ID or lease photo, ensuring the document is clear and the file is named correctly."}
                        </p>
                        <FileUploadZone
                            title={isArabic ? "اختر ملفاً وأضفه" : "Choose a file"}
                            helperText={isArabic ? "برجاء التأكد أن الصورة واضحة وبحد أقصى 2 ميجا." : "Please ensure the image is clear and max 2 MB."}
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

            <JoinAlreadyRegisteredModal
                isOpen={showAlreadyRegistered}
                onClose={() => {
                    setShowAlreadyRegistered(false);
                    router.replace("/profile");
                }}
                title={delegateStatus === "approved" ? (isArabic ? "تم القبول" : "Accepted") : isArabic ? "طلب قيد المراجعة" : "Request under review"}
                message={alreadyRegisteredMsg}
                actionLabel={isArabic ? "العودة للملف الشخصي" : "Back to profile"}
            />
        </>
    );
}

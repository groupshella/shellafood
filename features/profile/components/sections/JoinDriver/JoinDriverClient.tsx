"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";
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
import {
    FileUploadZone,
    TermsCheckbox,
} from "@/features/profile/components/shared/registration/FileUploadZone";
import { PasswordInput } from "@/features/profile/components/shared/registration/PasswordInput";
import { PhoneField } from "@/features/profile/components/shared/registration/PhoneInput";
import { useLanguage } from "@/features/language/useLanguage";
import { useDriverRegistration } from "@/features/profile/hooks/useDriverRegistration";
import { ChevronDown } from "lucide-react";

const EARNING_OPTIONS = [
    { value: "0" as const, label: { ar: "مستقل (Freelancer)", en: "Freelancer" } },
    { value: "1" as const, label: { ar: "براتب (Salary)", en: "Salary" } },
];

const IDENTITY_TYPE_OPTIONS = [
    { value: "passport" as const, label: { ar: "جواز سفر", en: "Passport" } },
    { value: "driving_license" as const, label: { ar: "رخصة قيادة", en: "Driving license" } },
];

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
                                                        : message === "طلبك قيد المراجعة، سيتم التواصل معك قريباً."
                                                            ? "Your request is under review. We will contact you soon."
                                                            : message}
        </p>
    );
}

// ── Generic object dropdown ───────────────────────────────────────────────────
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
            <div ref={ref} className="relative" id={fieldId}>
                <button
                    type="button"
                    onClick={() => !disabled && setOpen((p) => !p)}
                    disabled={disabled}
                    aria-haspopup="listbox"
                    aria-expanded={open}
                    aria-describedby={error ? errorId : undefined}
                    aria-invalid={!!error}
                    className={`${inputClassName} justify-between text-start ${error ? "border-[#DB2626] focus:border-[#DB2626] focus:ring-red-100 dark:focus:ring-red-900/30" : ""
                        } ${disabled ? "cursor-not-allowed opacity-60" : ""}`}
                >
                    <span className={selected ? "font-medium text-[#111B18] dark:text-gray-100" : "text-[#707784] dark:text-gray-500"}>
                        {selected?.label ?? placeholder}
                    </span>
                    <ChevronDown
                        className={`h-5 w-5 shrink-0 text-[#555555] transition-transform dark:text-gray-400 ${open ? "rotate-180" : ""}`}
                        strokeWidth={1.5}
                    />
                </button>

                {open && options.length > 0 && (
                    <ul
                        role="listbox"
                        className="absolute inset-x-0 top-[calc(100%+6px)] z-20 max-h-52 overflow-y-auto rounded-2xl border border-gray-100 bg-white shadow-[0_8px_30px_rgba(0,0,0,0.08)] dark:border-gray-700 dark:bg-gray-800 dark:shadow-[0_8px_30px_rgba(0,0,0,0.3)]"
                    >
                        {options.map((opt, idx) => (
                            <li key={opt.value} role="option" aria-selected={value === opt.value}>
                                <button
                                    type="button"
                                    onClick={() => { onChange(opt.value); setOpen(false); }}
                                    className={`w-full px-4 py-3.5 text-end text-[14px] transition-colors active:bg-gray-50 dark:active:bg-gray-700 ${value === opt.value ? "font-semibold text-[#30913F] dark:text-[#4db860]" : "text-gray-900 dark:text-gray-100"
                                        } ${idx > 0 ? "border-t border-gray-100 dark:border-gray-700" : ""}`}
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

// ── Multi-file upload section ─────────────────────────────────────────────────
function MultiFileSection({
    label,
    files,
    onAdd,
    onRemove,
    error,
    fieldId,
}: {
    label: string;
    files: File[];
    onAdd: (file: File) => void;
    onRemove: (index: number) => void;
    error?: string;
    fieldId?: string;
}) {
    const { isArabic } = useLanguage();
    return (
        <div className="flex flex-col gap-2" id={fieldId} data-error={!!error || undefined}>
            <h3 className={sectionTitleClass}>{label}</h3>
            {files.map((f, i) => (
                <FileUploadZone
                    key={i}
                    title={f.name}
                    uploaded={{ file: f, previewName: f.name }}
                    onSelect={onAdd}
                    onRemove={() => onRemove(i)}
                />
            ))}
            <FileUploadZone
                title={isArabic ? "أضف صورة للهوية الشخصية" : "Add an ID photo"}
                helperText={isArabic ? "برجاء التأكد أن الصورة واضحة وبحد أقصى 2 ميجا." : "Please ensure the image is clear and max 2 MB."}
                uploaded={null}
                onSelect={onAdd}
                onRemove={() => { }}
            />
            <FieldError message={error} />
        </div>
    );
}

// ── Main component ────────────────────────────────────────────────────────────
export function JoinDriverClient() {
    const router = useRouter();
    const { isArabic } = useLanguage();
    const [showSuccess, setShowSuccess] = useState(false);
    const [showAlreadyRegistered, setShowAlreadyRegistered] = useState(false);
    const [alreadyRegisteredMsg, setAlreadyRegisteredMsg] = useState("");
    const formRef = useRef<HTMLDivElement>(null);

    const {
        form,
        setField,
        zones,
        vehicles,
        isLoadingMeta,
        metaLoadError,
        retryMeta,
        isCheckingRegistration,
        isAlreadyRegistered,
        registrationCheckMsg,
        isSubmitting,
        fieldErrors,
        clearFieldError,
        handleAddFile,
        handleRemoveFile,
        submit,
    } = useDriverRegistration();

    // Show already-registered modal as soon as the on-mount check resolves
    useEffect(() => {
        if (!isCheckingRegistration && isAlreadyRegistered) {
            setAlreadyRegisteredMsg(registrationCheckMsg);
            setShowAlreadyRegistered(true);
        }
    }, [isCheckingRegistration, isAlreadyRegistered, registrationCheckMsg]);

    // Scroll to the first invalid field whenever errors are set or updated.
    // Uses setTimeout(0) so React has committed the DOM before we query it.
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
        } else if (result.alreadyRegistered) {
            setAlreadyRegisteredMsg(result.message || (isArabic ? "هذا الحساب مسجل مسبقاً" : "This account is already registered"));
            setShowAlreadyRegistered(true);
        }
        // Scroll is handled automatically by the fieldErrors useEffect above
    };

    const handleSuccessClose = () => {
        setShowSuccess(false);
        router.replace("/profile");
    };

    const zoneOptions = zones.map((z) => ({ value: String(z.id), label: z.name }));
    const vehicleOptions = vehicles.map((v) => ({ value: String(v.id), label: v.type }));
    const earningOptions = EARNING_OPTIONS.map((option) => ({
        value: option.value,
        label: isArabic ? option.label.ar : option.label.en,
    }));
    const identityTypeOptions = IDENTITY_TYPE_OPTIONS.map((option) => ({
        value: option.value,
        label: isArabic ? option.label.ar : option.label.en,
    }));

    return (
        <>
            <ProfileSubpageShell
                title={isArabic ? "انضم كرجل توصيل" : "Join as a delivery driver"}
                subtitle={isArabic ? "خطوات بسيطة لتكون بمثابة رجل التسليم" : "Simple steps to become a delivery driver"}
                subtitleAlign="start"
                relaxedHeader
                showHeaderBorder={false}
                showFooterBorder={false}
                footerClassName={footerAboveNavClass}
                mainClassName="pb-36"
                footer={
                    <PrimaryButton
                        onClick={handleSubmit}
                        disabled={isSubmitting || isLoadingMeta || isCheckingRegistration || isAlreadyRegistered}
                        className={`h-12 rounded-xl py-3 text-[16px] font-bold ${buttonShadow}`}
                    >
                        {isCheckingRegistration ? (isArabic ? "جاري التحقق..." : "Verifying...") : isSubmitting ? (isArabic ? "جاري الإرسال..." : "Submitting...") : isArabic ? "ارسال" : "Submit"}
                    </PrimaryButton>
                }
            >
                <div ref={formRef} className={`${formContainerClass} gap-5 pb-2`}>

                    {/* ── Meta load error ── */}
                    {metaLoadError && !isLoadingMeta && (
                        <div
                            role="alert"
                            className="flex flex-col gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 dark:border-amber-800/50 dark:bg-amber-950/30 sm:flex-row sm:items-center sm:justify-between md:col-span-2"
                        >
                            <div className="flex items-center gap-2">
                                <AlertCircle className="h-4 w-4 shrink-0 text-amber-600" />
                                <p className="text-[13px] font-medium text-amber-800 dark:text-amber-200">
                                    {isArabic ? "تعذر تحميل البيانات. اضغط لإعادة المحاولة" : "Could not load data. Tap to retry"}
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={retryMeta}
                                className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-[12px] font-semibold text-amber-700 transition-colors active:bg-amber-100 dark:text-amber-300 dark:active:bg-amber-900/40"
                                aria-label={isArabic ? "إعادة المحاولة" : "Retry"}
                            >
                                <RefreshCw className="h-3.5 w-3.5" />
                                {isArabic ? "إعادة" : "Retry"}
                            </button>
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

                    {/* ── Personal info ── */}
                    <FormField label={isArabic ? "الاسم الأول" : "First name"} required>
                        <input
                            type="text"
                            id="field-firstName"
                            value={form.firstName}
                            onChange={(e) => { setField("firstName", e.target.value); clearFieldError("firstName"); }}
                            placeholder={isArabic ? "الاسم الأول" : "First name"}
                            className={`${inputClassName} text-start ${fieldErrors.firstName ? "border-[#DB2626] focus:border-[#DB2626] focus:ring-red-100" : ""}`}
                            autoComplete="given-name"
                            aria-required
                            aria-invalid={!!fieldErrors.firstName}
                            aria-describedby={fieldErrors.firstName ? "err-firstName" : undefined}
                        />
                        <FieldError message={fieldErrors.firstName} id="err-firstName" />
                    </FormField>

                    <FormField label={isArabic ? "البريد الالكتروني" : "Email"} required>
                        <input
                            type="email"
                            inputMode="email"
                            id="field-email"
                            value={form.email}
                            onChange={(e) => { setField("email", e.target.value); clearFieldError("email"); }}
                            placeholder={isArabic ? "البريد الالكتروني" : "Email"}
                            className={`${inputClassName} text-start ${fieldErrors.email ? "border-[#DB2626] focus:border-[#DB2626] focus:ring-red-100" : ""}`}
                            autoComplete="email"
                            aria-required
                            aria-invalid={!!fieldErrors.email}
                            aria-describedby={fieldErrors.email ? "err-email" : undefined}
                        />
                        <FieldError message={fieldErrors.email} id="err-email" />
                    </FormField>

                    <FormField label={isArabic ? "رقم الهاتف" : "Phone number"} required>
                        <div
                            aria-invalid={!!fieldErrors.phone}
                            className={fieldErrors.phone ? "rounded-xl ring-1 ring-[#DB2626]" : ""}
                        >
                            <PhoneField
                                value={form.phone}
                                onChange={(v) => { setField("phone", v); clearFieldError("phone"); }}
                                placeholder="5x xxx xxxx"
                            />
                        </div>
                        <FieldError message={fieldErrors.phone} id="err-phone" />
                    </FormField>

                    <FormField label={isArabic ? "كلمة المرور" : "Password"} required>
                        <PasswordInput
                            value={form.password}
                            onChange={(v) => { setField("password", v); clearFieldError("password"); }}
                            placeholder={isArabic ? "كلمة المرور" : "Password"}
                            hasError={!!fieldErrors.password}
                        />
                        <FieldError message={fieldErrors.password} id="err-password" />
                    </FormField>

                    <FormField label={isArabic ? "تأكيد كلمة المرور" : "Confirm password"} required>
                        <PasswordInput
                            value={form.confirmPassword}
                            onChange={(v) => { setField("confirmPassword", v); clearFieldError("confirmPassword"); }}
                            placeholder={isArabic ? "تأكيد كلمة المرور" : "Confirm password"}
                            hasError={!!fieldErrors.confirmPassword}
                        />
                        <FieldError message={fieldErrors.confirmPassword} id="err-confirmPassword" />
                    </FormField>

                    {/* ── Identity ── */}
                    <section id="identity-section" className="scroll-mt-4 md:col-span-2">
                        <h2 className={sectionTitleClass}>{isArabic ? "الهوية الشخصية" : "Personal ID"}</h2>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                            <SelectDropdown
                                label={isArabic ? "اختر نوع الهوية" : "Choose ID type"}
                                value={form.identityType}
                                options={identityTypeOptions}
                                onChange={(v) => { setField("identityType", v); clearFieldError("identityType"); }}
                                placeholder={isArabic ? "اختر نوع الهوية" : "Choose ID type"}
                                required
                                error={fieldErrors.identityType}
                                fieldId="field-identityType"
                            />

                            <FormField label={isArabic ? "رقم الهوية" : "ID number"} required>
                                <input
                                    type="text"
                                    inputMode="numeric"
                                    id="field-identityNumber"
                                    value={form.identityNumber}
                                    onChange={(e) => { setField("identityNumber", e.target.value); clearFieldError("identityNumber"); }}
                                    placeholder={isArabic ? "أدخل رقم الهوية" : "Enter ID number"}
                                    className={`${inputClassName} text-start ${fieldErrors.identityNumber ? "border-[#DB2626] focus:border-[#DB2626] focus:ring-red-100" : ""}`}
                                    aria-required
                                    aria-invalid={!!fieldErrors.identityNumber}
                                    aria-describedby={fieldErrors.identityNumber ? "err-identityNumber" : undefined}
                                />
                                <FieldError message={fieldErrors.identityNumber} id="err-identityNumber" />
                            </FormField>

                            <MultiFileSection
                                label={isArabic ? "صور الهوية" : "ID photos"}
                                files={form.identityImages}
                                onAdd={(f) => {
                                    const err = handleAddFile("identityImages", f);
                                    if (err) clearFieldError("identityImages");
                                }}
                                onRemove={(i) => handleRemoveFile("identityImages", i)}
                                error={fieldErrors.identityImages}
                                fieldId="field-identityImages"
                            />

                            <MultiFileSection
                                label={isArabic ? "صور رخصة المركبة" : "Vehicle license photos"}
                                files={form.drivingLicenseImages}
                                onAdd={(f) => handleAddFile("drivingLicenseImages", f)}
                                onRemove={(i) => handleRemoveFile("drivingLicenseImages", i)}
                                error={fieldErrors.drivingLicenseImages}
                            />

                            <MultiFileSection
                                label={isArabic ? "صور رخصة القيادة" : "Driver license photos"}
                                files={form.driverLicenseImages}
                                onAdd={(f) => handleAddFile("driverLicenseImages", f)}
                                onRemove={(i) => handleRemoveFile("driverLicenseImages", i)}
                                error={fieldErrors.driverLicenseImages}
                            />
                        </div>
                    </section>

                    {/* ── Work details ── */}
                    <section id="work-section" className="scroll-mt-4 md:col-span-2">
                        <h2 className={sectionTitleClass}>{isArabic ? "تفاصيل العمل" : "Work details"}</h2>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

                            <SelectDropdown
                                label={isArabic ? "اختر العنوان" : "Choose address"}
                                value={form.zoneId}
                                options={zoneOptions}
                                onChange={(v) => { setField("zoneId", v); clearFieldError("zoneId"); }}
                                placeholder={isLoadingMeta ? (isArabic ? "جاري التحميل..." : "Loading...") : isArabic ? "اختر العنوان" : "Choose address"}
                                required
                                error={fieldErrors.zoneId}
                                fieldId="field-zoneId"
                                disabled={isLoadingMeta}
                            />

                            <SelectDropdown
                                label={isArabic ? "اختر وسيلة التوصيل" : "Choose delivery method"}
                                value={form.vehicleId}
                                options={vehicleOptions}
                                onChange={(v) => { setField("vehicleId", v); clearFieldError("vehicleId"); }}
                                placeholder={isLoadingMeta ? (isArabic ? "جاري التحميل..." : "Loading...") : isArabic ? "اختر وسيلة التوصيل" : "Choose delivery method"}
                                required
                                error={fieldErrors.vehicleId}
                                fieldId="field-vehicleId"
                                disabled={isLoadingMeta}
                            />

                            <SelectDropdown
                                label={isArabic ? "اختر نوع العمل" : "Choose work type"}
                                value={form.earning}
                                options={earningOptions}
                                onChange={(v) => { setField("earning", v); clearFieldError("earning"); }}
                                placeholder={isArabic ? "اختر نوع العمل" : "Choose work type"}
                                required
                                error={fieldErrors.earning}
                                fieldId="field-earning"
                            />
                        </div>
                    </section>

                    <div className="md:col-span-2" data-error={!!fieldErrors.agreed || undefined}>
                        <TermsCheckbox
                            checked={form.agreed}
                            onChange={(v) => { setField("agreed", v); clearFieldError("agreed"); }}
                            label={isArabic ? "أوافق على الشروط وسياسة الخصوصية" : "I agree to the terms and privacy policy"}
                        />
                        <FieldError message={fieldErrors.agreed} />
                    </div>
                </div>
            </ProfileSubpageShell>

            <JoinSuccessModal isOpen={showSuccess} onClose={handleSuccessClose} />

            <JoinAlreadyRegisteredModal
                isOpen={showAlreadyRegistered}
                onClose={() => {
                    setShowAlreadyRegistered(false);
                    router.replace("/profile");
                }}
                title={isArabic ? "مسجل مسبقاً" : "Already registered"}
                message={
                    isArabic
                        ? "طلبك قيد المراجعة، سيتم التواصل معك قريباً."
                        : alreadyRegisteredMsg === "تم قبولك كمندوب تسويق. مرحباً بك!"
                            ? "You have been accepted as a marketing rep. Welcome!"
                            : "Your request is under review. We will contact you soon."
                }
                actionLabel={isArabic ? "العودة للملف الشخصي" : "Back to profile"}
            />
        </>
    );
}

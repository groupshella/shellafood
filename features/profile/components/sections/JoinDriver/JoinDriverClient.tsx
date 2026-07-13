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
import { JOIN_STRINGS } from "@/features/profile/constants/join.strings";
import { useDriverRegistration } from "@/features/profile/hooks/useDriverRegistration";
import { scrollToFirstFormIssue } from "@/features/profile/lib/scroll-to-form-issue";
import type { JoinRegistrationState } from "@/features/profile/types/join.types";

const EARNING_OPTIONS = [
    { value: "0" as const, label: "مستقل (Freelancer)" },
    { value: "1" as const, label: "براتب (Salary)" },
];

const IDENTITY_TYPE_OPTIONS = [
    { value: "passport" as const, label: "جواز سفر" },
    { value: "driving_license" as const, label: "رخصة قيادة" },
];

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

function driverStatusBanner(
    status: JoinRegistrationState | null,
): { tone: "success" | "warning" | "info"; message: string } | null {
    if (!status || status === "none" || status === "rejected") return null;
    if (status === "pending") {
        return { tone: "warning", message: JOIN_STRINGS.driverPendingBanner };
    }
    if (status === "active") {
        return { tone: "success", message: JOIN_STRINGS.driverActiveBanner };
    }
    return { tone: "success", message: JOIN_STRINGS.driverAlreadyRegisteredBanner };
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
                            ? "border-[#DB2626] focus:border-[#DB2626] focus:ring-red-100 dark:focus:ring-red-900/30"
                            : ""
                    } ${disabled ? disabledInputClass : ""}`}
                >
                    <span
                        className={
                            selected
                                ? "font-medium text-[#111B18] dark:text-gray-100"
                                : "text-[#707784] dark:text-gray-500"
                        }
                    >
                        {selected?.label ?? placeholder}
                    </span>
                    <ChevronDown
                        className={`h-5 w-5 shrink-0 text-[#555555] transition-transform dark:text-gray-400 ${
                            open ? "rotate-180" : ""
                        }`}
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
                                    onClick={() => {
                                        onChange(opt.value);
                                        setOpen(false);
                                    }}
                                    className={`w-full px-4 py-3.5 text-end text-[14px] transition-colors active:bg-gray-50 dark:active:bg-gray-700 ${
                                        value === opt.value
                                            ? "font-semibold text-[#30913F] dark:text-[#4db860]"
                                            : "text-gray-900 dark:text-gray-100"
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

function MultiFileSection({
    label,
    files,
    onAdd,
    onRemove,
    error,
    fieldId,
    disabled,
}: {
    label: string;
    files: File[];
    onAdd: (file: File) => void;
    onRemove: (index: number) => void;
    error?: string;
    fieldId?: string;
    disabled?: boolean;
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
                />
            ))}
            {!disabled && (
                <FileUploadZone
                    title={JOIN_STRINGS.addIdPhoto}
                    uploaded={null}
                    onSelect={onAdd}
                    onRemove={() => {}}
                />
            )}
            <FieldError message={error} />
        </div>
    );
}

export function JoinDriverClient() {
    const router = useRouter();
    const [showSuccess, setShowSuccess] = useState(false);
    const formRef = useRef<HTMLDivElement>(null);

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
    } = useDriverRegistration();

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
    const vehicleOptions = vehicles.map((v) => ({ value: String(v.id), label: v.type }));
    const statusBanner = driverStatusBanner(registrationStatus);
    const fieldsDisabled = isFormLocked || isSubmitting;

    return (
        <>
            <ProfileSubpageShell
                title={JOIN_STRINGS.driverTitle}
                subtitle={JOIN_STRINGS.driverSubtitle}
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
                            isSubmitting || isLoadingMeta || isLoadingStatus || isFormLocked
                        }
                        className={`h-12 rounded-xl py-3 text-[16px] font-bold ${buttonShadow}`}
                    >
                        {isSubmitting ? JOIN_STRINGS.submitting : JOIN_STRINGS.send}
                    </PrimaryButton>
                }
            >
                <div ref={formRef} className={`${formContainerClass} gap-5 pb-2`}>
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
                            message={JOIN_STRINGS.metaLoadError}
                            className="md:col-span-2"
                            action={
                                <button
                                    type="button"
                                    onClick={retryMeta}
                                    className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-[12px] font-semibold text-amber-700 transition-colors active:bg-amber-100 dark:text-amber-300 dark:active:bg-amber-900/40"
                                    aria-label="إعادة المحاولة"
                                >
                                    <RefreshCw className="h-3.5 w-3.5" />
                                    إعادة
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

                    <FormField label={JOIN_STRINGS.firstName} required>
                        <input
                            type="text"
                            id="field-firstName"
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
                            } ${lockedFields.firstName || fieldsDisabled ? disabledInputClass : ""}`}
                            autoComplete="given-name"
                            aria-required
                            aria-invalid={!!fieldErrors.firstName}
                            aria-describedby={fieldErrors.firstName ? "err-firstName" : undefined}
                        />
                        <FieldError message={fieldErrors.firstName} id="err-firstName" />
                    </FormField>

                    <FormField label={JOIN_STRINGS.email} required>
                        <input
                            type="email"
                            inputMode="email"
                            id="field-email"
                            value={form.email}
                            onChange={(e) => {
                                setField("email", e.target.value);
                                clearFieldError("email");
                            }}
                            placeholder={JOIN_STRINGS.email}
                            disabled={fieldsDisabled || lockedFields.email}
                            className={`${inputClassName} text-start ${
                                fieldErrors.email
                                    ? "border-[#DB2626] focus:border-[#DB2626] focus:ring-red-100"
                                    : ""
                            } ${lockedFields.email || fieldsDisabled ? disabledInputClass : ""}`}
                            autoComplete="email"
                            aria-required
                            aria-invalid={!!fieldErrors.email}
                            aria-describedby={fieldErrors.email ? "err-email" : undefined}
                        />
                        <FieldError message={fieldErrors.email} id="err-email" />
                    </FormField>

                    <FormField label={JOIN_STRINGS.phone} required>
                        <div
                            aria-invalid={!!fieldErrors.phone}
                            data-error={fieldErrors.phone ? "true" : undefined}
                            className={fieldErrors.phone ? "rounded-xl ring-1 ring-[#DB2626]" : ""}
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

                    <FormField label={JOIN_STRINGS.password} required>
                        <PasswordInput
                            value={form.password}
                            onChange={(v) => {
                                setField("password", v);
                                clearFieldError("password");
                            }}
                            placeholder={JOIN_STRINGS.password}
                            hasError={!!fieldErrors.password}
                            disabled={fieldsDisabled}
                        />
                        <FieldError message={fieldErrors.password} id="err-password" />
                    </FormField>

                    <FormField label={JOIN_STRINGS.confirmPassword} required>
                        <PasswordInput
                            value={form.confirmPassword}
                            onChange={(v) => {
                                setField("confirmPassword", v);
                                clearFieldError("confirmPassword");
                            }}
                            placeholder={JOIN_STRINGS.confirmPassword}
                            hasError={!!fieldErrors.confirmPassword}
                            disabled={fieldsDisabled}
                        />
                        <FieldError message={fieldErrors.confirmPassword} id="err-confirmPassword" />
                    </FormField>

                    <section id="identity-section" className="scroll-mt-4 md:col-span-2">
                        <h2 className={sectionTitleClass}>{JOIN_STRINGS.personalId}</h2>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <SelectDropdown
                                label={JOIN_STRINGS.chooseIdType}
                                value={form.identityType}
                                options={IDENTITY_TYPE_OPTIONS}
                                onChange={(v) => {
                                    setField("identityType", v);
                                    clearFieldError("identityType");
                                }}
                                placeholder={JOIN_STRINGS.chooseIdType}
                                required
                                error={fieldErrors.identityType}
                                fieldId="field-identityType"
                                disabled={fieldsDisabled}
                            />

                            <FormField label="رقم الهوية" required>
                                <input
                                    type="text"
                                    inputMode="numeric"
                                    id="field-identityNumber"
                                    value={form.identityNumber}
                                    onChange={(e) => {
                                        setField("identityNumber", e.target.value);
                                        clearFieldError("identityNumber");
                                    }}
                                    placeholder="أدخل رقم الهوية"
                                    disabled={fieldsDisabled}
                                    className={`${inputClassName} text-start ${
                                        fieldErrors.identityNumber
                                            ? "border-[#DB2626] focus:border-[#DB2626] focus:ring-red-100"
                                            : ""
                                    } ${fieldsDisabled ? disabledInputClass : ""}`}
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
                                label="صور الهوية"
                                files={form.identityImages}
                                onAdd={(f) => handleAddFile("identityImages", f)}
                                onRemove={(i) => handleRemoveFile("identityImages", i)}
                                error={fieldErrors.identityImages}
                                fieldId="field-identityImages"
                                disabled={fieldsDisabled}
                            />

                            <MultiFileSection
                                label="صور رخصة المركبة"
                                files={form.drivingLicenseImages}
                                onAdd={(f) => handleAddFile("drivingLicenseImages", f)}
                                onRemove={(i) => handleRemoveFile("drivingLicenseImages", i)}
                                error={fieldErrors.drivingLicenseImages}
                                disabled={fieldsDisabled}
                            />

                            <MultiFileSection
                                label="صور رخصة القيادة"
                                files={form.driverLicenseImages}
                                onAdd={(f) => handleAddFile("driverLicenseImages", f)}
                                onRemove={(i) => handleRemoveFile("driverLicenseImages", i)}
                                error={fieldErrors.driverLicenseImages}
                                disabled={fieldsDisabled}
                            />
                        </div>
                    </section>

                    <section id="work-section" className="scroll-mt-4 md:col-span-2">
                        <h2 className={sectionTitleClass}>تفاصيل العمل</h2>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                            <SelectDropdown
                                label={JOIN_STRINGS.chooseAddress}
                                value={form.zoneId}
                                options={zoneOptions}
                                onChange={(v) => {
                                    setField("zoneId", v);
                                    clearFieldError("zoneId");
                                }}
                                placeholder={
                                    isLoadingMeta ? "جاري التحميل..." : JOIN_STRINGS.chooseAddress
                                }
                                required
                                error={fieldErrors.zoneId}
                                fieldId="field-zoneId"
                                disabled={isLoadingMeta || fieldsDisabled}
                            />

                            <SelectDropdown
                                label={JOIN_STRINGS.chooseDeliveryMethod}
                                value={form.vehicleId}
                                options={vehicleOptions}
                                onChange={(v) => {
                                    setField("vehicleId", v);
                                    clearFieldError("vehicleId");
                                }}
                                placeholder={
                                    isLoadingMeta
                                        ? "جاري التحميل..."
                                        : JOIN_STRINGS.chooseDeliveryMethod
                                }
                                required
                                error={fieldErrors.vehicleId}
                                fieldId="field-vehicleId"
                                disabled={isLoadingMeta || fieldsDisabled}
                            />

                            <SelectDropdown
                                label={JOIN_STRINGS.chooseWorkType}
                                value={form.earning}
                                options={EARNING_OPTIONS}
                                onChange={(v) => {
                                    setField("earning", v);
                                    clearFieldError("earning");
                                }}
                                placeholder={JOIN_STRINGS.chooseWorkType}
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
                        />
                        <FieldError message={fieldErrors.agreed} />
                    </div>
                </div>
            </ProfileSubpageShell>

            <JoinSuccessModal isOpen={showSuccess} onClose={handleSuccessClose} />
        </>
    );
}

"use client";

import { ChevronDown, FileText } from "lucide-react";
import { useRef, useState } from "react";
import { useLanguage } from "@/features/language/useLanguage";
import type { WalletFormData } from "../types";

type LocalizedOption = { ar: string; en: string };

const inputCls =
    "h-14 w-full rounded-xl border border-[#F6F5F8] bg-[#F6F5F8] px-3 py-[14px] text-end text-[14px] text-[#111B18] outline-none placeholder:text-[#555555] dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-500 sm:px-4";

const inputWithIconCls =
    "flex h-14 w-full items-center justify-between rounded-xl border border-[#F6F5F8] bg-[#F6F5F8] px-3 dark:border-gray-700 dark:bg-gray-800 sm:px-4";

function WField({
    label,
    required,
    children,
}: {
    label: string;
    required?: boolean;
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col gap-2">
            <div className="flex items-center gap-1">
                {required && (
                    <span className="text-[12px] font-bold text-[#DB2626]">*</span>
                )}
                <span className="text-[14px] font-bold text-[#111B18] dark:text-gray-100 sm:text-[15px]">{label}</span>
            </div>
            {children}
        </div>
    );
}

function WDropdown({
    label,
    required,
    value,
    options,
    placeholder,
    locale,
    onChange,
}: {
    label: string;
    required?: boolean;
    value: string;
    options: LocalizedOption[];
    placeholder: string;
    locale: "ar" | "en";
    onChange: (v: string) => void;
}) {
    const [open, setOpen] = useState(false);
    const selectedOption = options.find((opt) => opt.ar === value || opt.en === value);
    const displayValue = selectedOption ? selectedOption[locale] : value;

    return (
        <WField label={label} required={required}>
            <div className="relative">
                <button
                    type="button"
                    onClick={() => setOpen((p) => !p)}
                    className={inputWithIconCls}
                >
                    <ChevronDown
                        className={`h-6 w-6 shrink-0 text-[#555555] transition-transform dark:text-gray-400 ${open ? "rotate-180" : ""}`}
                        strokeWidth={1.5}
                    />
                    <span
                        className={`text-[14px] ${value ? "text-[#111B18] dark:text-gray-100" : "text-[#555555] dark:text-gray-500"}`}
                    >
                        {displayValue || placeholder}
                    </span>
                </button>
                {open && (
                    <ul className="absolute inset-x-0 top-[calc(100%+4px)] z-20 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-[0_8px_30px_rgba(0,0,0,0.08)] dark:border-gray-700 dark:bg-gray-800 dark:shadow-[0_8px_30px_rgba(0,0,0,0.3)]">
                        {options.map((opt, i) => (
                            <li key={opt.ar}>
                                <button
                                    type="button"
                                    onClick={() => {
                                        onChange(opt[locale]);
                                        setOpen(false);
                                    }}
                                    className={`w-full px-4 py-3 text-end text-[14px] transition-colors active:bg-gray-50 dark:active:bg-gray-700 ${
                                        value === opt.ar || value === opt.en
                                            ? "font-semibold text-[#30913F] dark:text-[#4db860]"
                                            : "text-[#111B18] dark:text-gray-100"
                                    } ${i > 0 ? "border-t border-gray-100 dark:border-gray-700" : ""}`}
                                >
                                    {opt[locale]}
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </WField>
    );
}

function WRadioGroup({
    label,
    options,
    value,
    locale,
    onChange,
}: {
    label: string;
    options: LocalizedOption[];
    value: string;
    locale: "ar" | "en";
    onChange: (v: string) => void;
}) {
    return (
        <WField label={label}>
            <div className="overflow-hidden rounded-xl bg-[#F6F5F8] dark:bg-gray-800">
                {options.map((opt, i) => (
                    <button
                        key={opt.ar}
                        type="button"
                        onClick={() => onChange(opt[locale])}
                        className={`flex w-full items-center justify-between px-4 py-4 ${
                            i > 0 ? "border-t border-[#F6F5F8] bg-white dark:border-gray-700 dark:bg-gray-900" : ""
                        }`}
                    >
                        <span
                            className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                                value === opt.ar || value === opt.en ? "border-[#111B18] dark:border-gray-200" : "border-[#D1D5DB] dark:border-gray-600"
                            }`}
                        >
                            {(value === opt.ar || value === opt.en) && (
                                <span className="h-2.5 w-2.5 rounded-full bg-[#111B18] dark:bg-gray-200" />
                            )}
                        </span>
                        <span className="text-[16px] font-medium text-[#111B18] dark:text-gray-100">{opt[locale]}</span>
                    </button>
                ))}
            </div>
        </WField>
    );
}

const INCOME_SOURCES: LocalizedOption[] = [
    { ar: "راتب حكومي", en: "Government salary" },
    { ar: "راتب خاص", en: "Private-sector salary" },
    { ar: "أعمال حرة", en: "Freelance work" },
    { ar: "تجارة", en: "Business" },
    { ar: "أخرى", en: "Other" },
];
const SALARY_DAYS: LocalizedOption[] = [
    { ar: "أول الشهر", en: "Start of the month" },
    { ar: "الخامس", en: "5th" },
    { ar: "العاشر", en: "10th" },
    { ar: "الخامس عشر", en: "15th" },
    { ar: "العشرون", en: "20th" },
    { ar: "الخامس والعشرون", en: "25th" },
    { ar: "نهاية الشهر", en: "End of the month" },
];
const INSTALLMENT_OPTIONS: LocalizedOption[] = [
    { ar: "نعم", en: "Yes" },
    { ar: "لا", en: "No" },
];

interface IncomeStepProps {
    data: WalletFormData;
    onChange: (updates: Partial<WalletFormData>) => void;
    onNext: () => void;
}

export function IncomeStep({ data, onChange, onNext }: IncomeStepProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { isArabic, locale } = useLanguage();

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            onChange({ uploadedDoc: { file, previewName: file.name } });
        }
        e.target.value = "";
    };

    return (
        <div className="flex flex-col gap-4 pb-6 sm:gap-5">
            {/* Income Source Card */}
            <div className="rounded-2xl bg-[#F6F5F8] p-3 dark:bg-gray-800/50 sm:p-4">
                <h2 className="mb-4 text-center text-[16px] font-bold text-[#555555] dark:text-gray-400">
                    {isArabic ? "مصدر الدخل" : "Income source"}
                </h2>
                <div className="grid grid-cols-1 gap-4 rounded-2xl bg-white p-3 shadow-[0px_4px_8.9px_rgba(0,0,0,0.03)] dark:bg-gray-900 dark:shadow-[0px_4px_8.9px_rgba(0,0,0,0.2)] sm:p-4 md:grid-cols-2">
                    <WDropdown
                        label={isArabic ? "اختر مصدر الدخل الرئيسي" : "Select primary income source"}
                        required
                        value={data.incomeSource}
                        options={INCOME_SOURCES}
                        placeholder={isArabic ? "اختر مصدر الدخل الرئيسي" : "Select primary income source"}
                        locale={locale}
                        onChange={(v) => onChange({ incomeSource: v })}
                    />

                    <WField label={isArabic ? "اسم جهة العمل" : "Employer name"} required>
                        <input
                            className={inputCls}
                            placeholder={isArabic ? "اسم جهة العمل" : "Employer name"}
                            value={data.employerName}
                            onChange={(e) => onChange({ employerName: e.target.value })}
                            dir={isArabic ? "rtl" : "ltr"}
                        />
                    </WField>

                    <WField label={isArabic ? "الدخل الشهري" : "Monthly income"} required>
                        <input
                            className={inputCls}
                            placeholder={isArabic ? "الدخل الشهري" : "Monthly income"}
                            value={data.monthlyIncome}
                            onChange={(e) => onChange({ monthlyIncome: e.target.value })}
                            dir={isArabic ? "rtl" : "ltr"}
                        />
                    </WField>

                    <WDropdown
                        label={isArabic ? "ما هو يوم استلام راتبك" : "What day do you receive your salary?"}
                        required
                        value={data.salaryDay}
                        options={SALARY_DAYS}
                        placeholder={isArabic ? "اختر اليوم" : "Select day"}
                        locale={locale}
                        onChange={(v) => onChange({ salaryDay: v })}
                    />

                    <WRadioGroup
                        label={isArabic ? "هل لديك أي أقساط؟" : "Do you have any installments?"}
                        options={INSTALLMENT_OPTIONS}
                        value={data.hasInstallments}
                        locale={locale}
                        onChange={(v) => onChange({ hasInstallments: v })}
                    />
                </div>
            </div>

            {/* Documents Card */}
            <div className="rounded-2xl bg-[#F6F5F8] p-3 dark:bg-gray-800/50 sm:p-4">
                <div className="flex flex-col gap-3 rounded-2xl bg-white p-3 shadow-[0px_4px_8.9px_rgba(0,0,0,0.03)] dark:bg-gray-900 dark:shadow-[0px_4px_8.9px_rgba(0,0,0,0.2)] sm:p-4">
                    <p className="text-end text-[14px] font-medium leading-relaxed text-[#000000] dark:text-gray-200">
                        {isArabic
                            ? "أرفق صوراً واضحة لمستنداتك مثل الهوية أو عقد الإيجار، وسم كل ملف قبل رفعه"
                            : "Attach clear images of your documents, such as your ID or lease contract, and name each file before uploading it"}
                    </p>

                    {data.uploadedDoc ? (
                        <div className="flex items-center gap-3 rounded-xl border border-[#30913F]/30 bg-[#E8F5E9] px-4 py-3 dark:border-[#30913F]/40 dark:bg-[#30913F]/10">
                            <button
                                type="button"
                                onClick={() => onChange({ uploadedDoc: null })}
                                className="text-[13px] font-medium text-red-500"
                            >
                                {isArabic ? "حذف" : "Delete"}
                            </button>
                            <span className="min-w-0 flex-1 truncate text-end text-[14px] font-semibold text-[#111B18] dark:text-gray-100">
                                {data.uploadedDoc.previewName}
                            </span>
                            <FileText className="h-5 w-5 shrink-0 text-[#30913F]" />
                        </div>
                    ) : (
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="flex min-h-[92px] w-full items-center gap-3 rounded-xl border border-dashed border-[#C6C8CE] bg-white px-4 py-4 transition-colors active:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:active:bg-gray-700"
                        >
                            <div className="flex min-w-0 flex-1 flex-col items-end gap-0.5">
                                <span className="text-[14px] font-bold text-[#000000] dark:text-gray-100">
                                    {isArabic ? "اختر ملفاً وأضفه" : "Choose and add a file"}
                                </span>
                                <span className="text-end text-[12px] font-medium text-[#000000] dark:text-gray-400">
                                    {isArabic
                                        ? "برجاء التأكد أن الحد أقصى 5 ميجا pdf, jpg, png"
                                        : "Please make sure the file is no larger than 5 MB: pdf, jpg, png"}
                                </span>
                            </div>
                            <FileText
                                className="h-6 w-6 shrink-0 text-[#111B18] dark:text-gray-300"
                                strokeWidth={1.5}
                            />
                        </button>
                    )}

                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*,.pdf"
                        className="hidden"
                        onChange={handleFileSelect}
                    />
                </div>
            </div>

            {/* Button */}
            <div className="pt-2">
                <button
                    type="button"
                    onClick={onNext}
                    className="min-h-[48px] w-full rounded-xl bg-[#30913F] px-4 text-[16px] font-bold text-white active:bg-[#267332] sm:min-h-[52px]"
                >
                    {isArabic ? "التالي" : "Next"}
                </button>
            </div>
        </div>
    );
}

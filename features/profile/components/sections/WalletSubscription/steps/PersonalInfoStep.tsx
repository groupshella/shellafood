"use client";

import { Calendar, ChevronDown } from "lucide-react";
import { useState } from "react";
import { useLanguage } from "@/features/language/useLanguage";
import { PhoneField } from "@/features/profile/components/shared/registration/PhoneInput";
import type { WalletFormData } from "../types";

type LocalizedOption = { ar: string; en: string };

const inputCls =
    "h-14 w-full rounded-xl border border-[#F6F5F8] bg-[#F6F5F8] px-3 py-[14px] text-end text-[14px] text-[#111B18] outline-none placeholder:text-[#555555] dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-500 sm:px-4";

const inputWithIconCls =
    "flex h-14 w-full items-center rounded-xl border border-[#F6F5F8] bg-[#F6F5F8] px-3 dark:border-gray-700 dark:bg-gray-800 sm:px-4";

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
    extra,
}: {
    label: string;
    required?: boolean;
    value: string;
    options: LocalizedOption[];
    placeholder: string;
    locale: "ar" | "en";
    onChange: (v: string) => void;
    extra?: React.ReactNode;
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
                    className={`${inputWithIconCls} justify-between`}
                >
                    <ChevronDown
                        className={`h-6 w-6 shrink-0 text-[#555555] transition-transform dark:text-gray-400 ${open ? "rotate-180" : ""}`}
                        strokeWidth={1.5}
                    />
                    <div className="flex items-center gap-1">
                        {extra}
                        <span
                            className={`text-[14px] ${value ? "text-[#111B18] dark:text-gray-100" : "text-[#555555] dark:text-gray-500"}`}
                        >
                            {displayValue || placeholder}
                        </span>
                    </div>
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
                        className={`flex w-full items-center justify-between px-4 py-4 text-[16px] text-[#111B18] dark:text-gray-100 ${
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

const NATIONALITY_OPTIONS: LocalizedOption[] = [
    { ar: "سعودي", en: "Saudi" },
    { ar: "مصري", en: "Egyptian" },
    { ar: "كويتي", en: "Kuwaiti" },
    { ar: "إماراتي", en: "Emirati" },
    { ar: "أردني", en: "Jordanian" },
];
const MARITAL_OPTIONS: LocalizedOption[] = [
    { ar: "أعذب", en: "Single" },
    { ar: "متزوج", en: "Married" },
    { ar: "مطلق", en: "Divorced" },
];
const HOME_TYPE_OPTIONS: LocalizedOption[] = [
    { ar: "منزل", en: "House" },
    { ar: "شقة", en: "Apartment" },
    { ar: "فيلا", en: "Villa" },
];
const CITY_OPTIONS: LocalizedOption[] = [
    { ar: "الرياض", en: "Riyadh" },
    { ar: "جدة", en: "Jeddah" },
    { ar: "مكة المكرمة", en: "Makkah" },
    { ar: "المدينة المنورة", en: "Madinah" },
    { ar: "الدمام", en: "Dammam" },
    { ar: "الخبر", en: "Khobar" },
];

interface PersonalInfoStepProps {
    data: WalletFormData;
    onChange: (updates: Partial<WalletFormData>) => void;
    onNext: () => void;
    onViewContract: () => void;
}

export function PersonalInfoStep({
    data,
    onChange,
    onNext,
    onViewContract,
}: PersonalInfoStepProps) {
    const { isArabic, locale } = useLanguage();

    return (
        <div className="flex flex-col gap-4 pb-6 sm:gap-5">
            {/* Personal Information Card */}
            <div className="rounded-2xl bg-[#F6F5F8] p-3 dark:bg-gray-800/50 sm:p-4">
                <h2 className="mb-4 text-center text-[16px] font-bold text-[#555555] dark:text-gray-400">
                    {isArabic ? "المعلومات الشخصية" : "Personal information"}
                </h2>
                <div className="grid grid-cols-1 gap-4 rounded-2xl bg-white p-3 shadow-[0px_4px_8.9px_rgba(0,0,0,0.03)] dark:bg-gray-900 dark:shadow-[0px_4px_8.9px_rgba(0,0,0,0.2)] sm:p-4 md:grid-cols-2">
                    <WField label={isArabic ? "الاسم الأول" : "First name"} required>
                        <input
                            className={inputCls}
                            placeholder={isArabic ? "الاسم الأول" : "First name"}
                            value={data.firstName}
                            onChange={(e) => onChange({ firstName: e.target.value })}
                            dir={isArabic ? "rtl" : "ltr"}
                        />
                    </WField>

                    <WField label={isArabic ? "اسم الاب" : "Father's name"} required>
                        <input
                            className={inputCls}
                            placeholder={isArabic ? "اسم الاب" : "Father's name"}
                            value={data.fatherName}
                            onChange={(e) => onChange({ fatherName: e.target.value })}
                            dir={isArabic ? "rtl" : "ltr"}
                        />
                    </WField>

                    <WField label={isArabic ? "اسم الجد" : "Grandfather's name"}>
                        <input
                            className={inputCls}
                            placeholder={isArabic ? "اسم الجد" : "Grandfather's name"}
                            value={data.grandfatherName}
                            onChange={(e) => onChange({ grandfatherName: e.target.value })}
                            dir={isArabic ? "rtl" : "ltr"}
                        />
                    </WField>

                    <WField label={isArabic ? "اسم العائلة" : "Family name"} required>
                        <input
                            className={inputCls}
                            placeholder={isArabic ? "اسم العائلة" : "Family name"}
                            value={data.familyName}
                            onChange={(e) => onChange({ familyName: e.target.value })}
                            dir={isArabic ? "rtl" : "ltr"}
                        />
                    </WField>

                    {/* Birth date */}
                    <WField label={isArabic ? "تاريخ الميلاد" : "Date of birth"} required>
                        <div className={inputWithIconCls + " justify-between"}>
                            <Calendar
                                className="h-6 w-6 shrink-0 text-[#555555] dark:text-gray-400"
                                strokeWidth={1.5}
                            />
                            <input
                                className="flex-1 bg-transparent text-end text-[14px] text-[#111B18] outline-none placeholder:text-[#555555] dark:text-gray-100 dark:placeholder:text-gray-500"
                                placeholder="yyyy / mm / dd"
                                value={data.birthDate}
                                onChange={(e) => onChange({ birthDate: e.target.value })}
                                dir="ltr"
                            />
                        </div>
                    </WField>

                    {/* Nationality */}
                    <WDropdown
                        label={isArabic ? "اختر الجنسية" : "Select nationality"}
                        required
                        value={data.nationality}
                        options={NATIONALITY_OPTIONS}
                        placeholder={isArabic ? "اختر الجنسية" : "Select nationality"}
                        locale={locale}
                        onChange={(v) => onChange({ nationality: v })}
                        extra={
                            data.nationality === "سعودي" || data.nationality === "Saudi" ? (
                                <span className="text-lg leading-none">🇸🇦</span>
                            ) : null
                        }
                    />

                    {/* Marital status */}
                    <WRadioGroup
                        label={isArabic ? "الحالة الاجتماعية" : "Marital status"}
                        options={MARITAL_OPTIONS}
                        value={data.maritalStatus}
                        locale={locale}
                        onChange={(v) => onChange({ maritalStatus: v })}
                    />

                    {/* Family count */}
                    <WField label={isArabic ? "عدد أفراد الأسرة" : "Number of family members"} required>
                        <input
                            className={inputCls}
                            type="number"
                            inputMode="numeric"
                            placeholder=""
                            value={data.familyCount}
                            onChange={(e) => onChange({ familyCount: e.target.value })}
                            dir="ltr"
                        />
                    </WField>

                    {/* ID number */}
                    <WField label={isArabic ? "رقم بطاقة الأحوال" : "National ID number"} required>
                        <input
                            className={inputCls}
                            placeholder="xxxxxxx-xxxxx-x"
                            value={data.idNumber}
                            onChange={(e) => onChange({ idNumber: e.target.value })}
                            dir="ltr"
                        />
                    </WField>

                    {/* ID expiry */}
                    <WField label={isArabic ? "تاريخ الانتهاء" : "Expiry date"} required>
                        <div className={inputWithIconCls + " justify-between"}>
                            <Calendar
                                className="h-6 w-6 shrink-0 text-[#555555] dark:text-gray-400"
                                strokeWidth={1.5}
                            />
                            <input
                                className="flex-1 bg-transparent text-end text-[14px] text-[#111B18] outline-none placeholder:text-[#555555] dark:text-gray-100 dark:placeholder:text-gray-500"
                                placeholder="yyyy / mm / dd"
                                value={data.idExpiryDate}
                                onChange={(e) => onChange({ idExpiryDate: e.target.value })}
                                dir="ltr"
                            />
                        </div>
                    </WField>

                    {/* Phone */}
                    <WField label={isArabic ? "رقم الهاتف" : "Phone number"} required>
                        <PhoneField
                            value={data.phone}
                            onChange={(phone) => onChange({ phone })}
                            placeholder="5x xxx xxxx"
                        />
                    </WField>
                </div>
            </div>

            {/* Housing Information Card */}
            <div className="rounded-2xl bg-[#F6F5F8] p-3 dark:bg-gray-800/50 sm:p-4">
                <h2 className="mb-4 text-center text-[16px] font-bold text-[#555555] dark:text-gray-400">
                    {isArabic ? "بيانات السكن" : "Housing details"}
                </h2>
                <div className="grid grid-cols-1 gap-4 rounded-2xl bg-white p-3 shadow-[0px_4px_8.9px_rgba(0,0,0,0.03)] dark:bg-gray-900 dark:shadow-[0px_4px_8.9px_rgba(0,0,0,0.2)] sm:p-4 md:grid-cols-2">
                    <WRadioGroup
                        label={isArabic ? "نوع المنزل" : "Home type"}
                        options={HOME_TYPE_OPTIONS}
                        value={data.homeType}
                        locale={locale}
                        onChange={(v) => onChange({ homeType: v })}
                    />

                    <WDropdown
                        label={isArabic ? "المدينة" : "City"}
                        required
                        value={data.city}
                        options={CITY_OPTIONS}
                        placeholder={isArabic ? "اختر المدينة" : "Select city"}
                        locale={locale}
                        onChange={(v) => onChange({ city: v })}
                    />

                    <WField label={isArabic ? "الحي" : "Neighborhood"} required>
                        <input
                            className={inputCls}
                            placeholder={isArabic ? "اسم الحي" : "Neighborhood name"}
                            value={data.neighborhood}
                            onChange={(e) => onChange({ neighborhood: e.target.value })}
                            dir={isArabic ? "rtl" : "ltr"}
                        />
                    </WField>
                </div>
            </div>

            {/* Buttons */}
            <div className="grid grid-cols-1 gap-3 pt-2 sm:grid-cols-2">
                <button
                    type="button"
                    onClick={onNext}
                    className="min-h-[48px] w-full rounded-xl bg-[#30913F] px-4 text-[16px] font-bold text-white active:bg-[#267332] sm:min-h-[52px]"
                >
                    {isArabic ? "التالي" : "Next"}
                </button>
                <button
                    type="button"
                    onClick={onViewContract}
                    className="min-h-[50px] w-full rounded-xl bg-[#F6F6F6] px-4 text-[16px] font-bold text-[#43474F] active:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:active:bg-gray-700"
                >
                    {isArabic ? "استعراض العقد قبل التوقيع" : "Review contract before signing"}
                </button>
            </div>
        </div>
    );
}

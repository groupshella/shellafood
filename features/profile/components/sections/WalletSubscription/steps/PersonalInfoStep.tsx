"use client";

import { Calendar, ChevronDown } from "lucide-react";
import { useState } from "react";
import { PhoneField } from "@/features/profile/components/shared/registration/PhoneInput";
import type { WalletFormData } from "../types";

const inputCls =
    "w-full rounded-xl border border-[#F6F5F8] bg-[#F6F5F8] px-3 py-[14px] text-[14px] text-[#111B18] outline-none placeholder:text-[#555555] h-14 text-end";

const inputWithIconCls =
    "flex h-14 w-full items-center rounded-xl border border-[#F6F5F8] bg-[#F6F5F8] px-3";

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
                <span className="text-[14px] font-bold text-[#111B18]">{label}</span>
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
    onChange,
    extra,
}: {
    label: string;
    required?: boolean;
    value: string;
    options: string[];
    placeholder: string;
    onChange: (v: string) => void;
    extra?: React.ReactNode;
}) {
    const [open, setOpen] = useState(false);
    return (
        <WField label={label} required={required}>
            <div className="relative">
                <button
                    type="button"
                    onClick={() => setOpen((p) => !p)}
                    className={`${inputWithIconCls} justify-between`}
                >
                    <ChevronDown
                        className={`h-6 w-6 shrink-0 text-[#555555] transition-transform ${open ? "rotate-180" : ""}`}
                        strokeWidth={1.5}
                    />
                    <div className="flex items-center gap-1">
                        {extra}
                        <span
                            className={`text-[14px] ${value ? "text-[#111B18]" : "text-[#555555]"}`}
                        >
                            {value || placeholder}
                        </span>
                    </div>
                </button>
                {open && (
                    <ul className="absolute inset-x-0 top-[calc(100%+4px)] z-20 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-[0_8px_30px_rgba(0,0,0,0.08)]">
                        {options.map((opt, i) => (
                            <li key={opt}>
                                <button
                                    type="button"
                                    onClick={() => {
                                        onChange(opt);
                                        setOpen(false);
                                    }}
                                    className={`w-full px-4 py-3 text-end text-[14px] transition-colors active:bg-gray-50 ${
                                        value === opt
                                            ? "font-semibold text-[#30913F]"
                                            : "text-[#111B18]"
                                    } ${i > 0 ? "border-t border-gray-100" : ""}`}
                                >
                                    {opt}
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
    onChange,
}: {
    label: string;
    options: string[];
    value: string;
    onChange: (v: string) => void;
}) {
    return (
        <WField label={label}>
            <div className="overflow-hidden rounded-xl bg-[#F6F5F8]">
                {options.map((opt, i) => (
                    <button
                        key={opt}
                        type="button"
                        onClick={() => onChange(opt)}
                        className={`flex w-full items-center justify-between px-4 py-4 text-[16px] text-[#111B18] ${
                            i > 0 ? "border-t border-[#F6F5F8] bg-white" : ""
                        }`}
                    >
                        <span
                            className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                                value === opt ? "border-[#111B18]" : "border-[#D1D5DB]"
                            }`}
                        >
                            {value === opt && (
                                <span className="h-2.5 w-2.5 rounded-full bg-[#111B18]" />
                            )}
                        </span>
                        <span className="text-[16px] font-medium text-[#111B18]">{opt}</span>
                    </button>
                ))}
            </div>
        </WField>
    );
}

const NATIONALITY_OPTIONS = ["سعودي", "مصري", "كويتي", "إماراتي", "أردني"];
const MARITAL_OPTIONS = ["أعذب", "متزوج", "مطلق"];
const HOME_TYPE_OPTIONS = ["منزل", "شقة", "فيلا"];
const CITY_OPTIONS = ["الرياض", "جدة", "مكة المكرمة", "المدينة المنورة", "الدمام", "الخبر"];

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
    return (
        <div className="flex flex-col gap-4 pb-6">
            {/* Personal Information Card */}
            <div className="rounded-2xl bg-[#F6F5F8] p-4">
                <h2 className="mb-4 text-center text-[16px] font-bold text-[#555555]">
                    المعلومات الشخصية
                </h2>
                <div className="flex flex-col gap-4 rounded-2xl bg-white p-4 shadow-[0px_4px_8.9px_rgba(0,0,0,0.03)]">
                    <WField label="الاسم الأول" required>
                        <input
                            className={inputCls}
                            placeholder="الاسم الأول"
                            value={data.firstName}
                            onChange={(e) => onChange({ firstName: e.target.value })}
                            dir="rtl"
                        />
                    </WField>

                    <WField label="اسم الاب" required>
                        <input
                            className={inputCls}
                            placeholder="اسم الاب"
                            value={data.fatherName}
                            onChange={(e) => onChange({ fatherName: e.target.value })}
                            dir="rtl"
                        />
                    </WField>

                    <WField label="اسم الجد">
                        <input
                            className={inputCls}
                            placeholder="اسم الجد"
                            value={data.grandfatherName}
                            onChange={(e) => onChange({ grandfatherName: e.target.value })}
                            dir="rtl"
                        />
                    </WField>

                    <WField label="اسم العائلة" required>
                        <input
                            className={inputCls}
                            placeholder="اسم العائلة"
                            value={data.familyName}
                            onChange={(e) => onChange({ familyName: e.target.value })}
                            dir="rtl"
                        />
                    </WField>

                    {/* Birth date */}
                    <WField label="تاريخ الميلاد" required>
                        <div className={inputWithIconCls + " justify-between"}>
                            <Calendar
                                className="h-6 w-6 shrink-0 text-[#555555]"
                                strokeWidth={1.5}
                            />
                            <input
                                className="flex-1 bg-transparent text-end text-[14px] text-[#111B18] outline-none placeholder:text-[#555555]"
                                placeholder="yyyy / mm / dd"
                                value={data.birthDate}
                                onChange={(e) => onChange({ birthDate: e.target.value })}
                                dir="ltr"
                            />
                        </div>
                    </WField>

                    {/* Nationality */}
                    <WDropdown
                        label="اختر الجنسية"
                        required
                        value={data.nationality}
                        options={NATIONALITY_OPTIONS}
                        placeholder="اختر الجنسية"
                        onChange={(v) => onChange({ nationality: v })}
                        extra={
                            data.nationality === "سعودي" ? (
                                <span className="text-lg leading-none">🇸🇦</span>
                            ) : null
                        }
                    />

                    {/* Marital status */}
                    <WRadioGroup
                        label="الحالة الاجتماعية"
                        options={MARITAL_OPTIONS}
                        value={data.maritalStatus}
                        onChange={(v) => onChange({ maritalStatus: v })}
                    />

                    {/* Family count */}
                    <WField label="عدد أفراد الأسرة" required>
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
                    <WField label="رقم بطاقة الأحوال" required>
                        <input
                            className={inputCls}
                            placeholder="xxxxxxx-xxxxx-x"
                            value={data.idNumber}
                            onChange={(e) => onChange({ idNumber: e.target.value })}
                            dir="ltr"
                        />
                    </WField>

                    {/* ID expiry */}
                    <WField label="تاريخ الانتهاء" required>
                        <div className={inputWithIconCls + " justify-between"}>
                            <Calendar
                                className="h-6 w-6 shrink-0 text-[#555555]"
                                strokeWidth={1.5}
                            />
                            <input
                                className="flex-1 bg-transparent text-end text-[14px] text-[#111B18] outline-none placeholder:text-[#555555]"
                                placeholder="yyyy / mm / dd"
                                value={data.idExpiryDate}
                                onChange={(e) => onChange({ idExpiryDate: e.target.value })}
                                dir="ltr"
                            />
                        </div>
                    </WField>

                    {/* Phone */}
                    <WField label="رقم الهاتف" required>
                        <PhoneField
                            value={data.phone}
                            onChange={(phone) => onChange({ phone })}
                            placeholder="5x xxx xxxx"
                        />
                    </WField>
                </div>
            </div>

            {/* Housing Information Card */}
            <div className="rounded-2xl bg-[#F6F5F8] p-4">
                <h2 className="mb-4 text-center text-[16px] font-bold text-[#555555]">
                    بيانات السكن
                </h2>
                <div className="flex flex-col gap-4 rounded-2xl bg-white p-4 shadow-[0px_4px_8.9px_rgba(0,0,0,0.03)]">
                    <WRadioGroup
                        label="نوع المنزل"
                        options={HOME_TYPE_OPTIONS}
                        value={data.homeType}
                        onChange={(v) => onChange({ homeType: v })}
                    />

                    <WDropdown
                        label="المدينة"
                        required
                        value={data.city}
                        options={CITY_OPTIONS}
                        placeholder="اختر المدينة"
                        onChange={(v) => onChange({ city: v })}
                    />

                    <WField label="الحي" required>
                        <input
                            className={inputCls}
                            placeholder="اسم الحي"
                            value={data.neighborhood}
                            onChange={(e) => onChange({ neighborhood: e.target.value })}
                            dir="rtl"
                        />
                    </WField>
                </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col gap-3 pt-2">
                <button
                    type="button"
                    onClick={onNext}
                    className="h-12 w-full rounded-xl bg-[#30913F] text-[16px] font-bold text-white active:bg-[#267332]"
                >
                    التالي
                </button>
                <button
                    type="button"
                    onClick={onViewContract}
                    className="h-[50px] w-full rounded-xl bg-[#F6F6F6] text-[16px] font-bold text-[#43474F] active:bg-gray-200"
                >
                    استعراض العقد قبل التوقيع
                </button>
            </div>
        </div>
    );
}

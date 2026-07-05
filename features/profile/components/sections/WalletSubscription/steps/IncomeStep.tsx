"use client";

import { ChevronDown, FileText } from "lucide-react";
import { useRef, useState } from "react";
import type { WalletFormData } from "../types";

const inputCls =
    "w-full rounded-xl border border-[#F6F5F8] bg-[#F6F5F8] px-3 py-[14px] text-[14px] text-[#111B18] outline-none placeholder:text-[#555555] h-14 text-end";

const inputWithIconCls =
    "flex h-14 w-full items-center justify-between rounded-xl border border-[#F6F5F8] bg-[#F6F5F8] px-3";

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
}: {
    label: string;
    required?: boolean;
    value: string;
    options: string[];
    placeholder: string;
    onChange: (v: string) => void;
}) {
    const [open, setOpen] = useState(false);
    return (
        <WField label={label} required={required}>
            <div className="relative">
                <button
                    type="button"
                    onClick={() => setOpen((p) => !p)}
                    className={inputWithIconCls}
                >
                    <ChevronDown
                        className={`h-6 w-6 shrink-0 text-[#555555] transition-transform ${open ? "rotate-180" : ""}`}
                        strokeWidth={1.5}
                    />
                    <span
                        className={`text-[14px] ${value ? "text-[#111B18]" : "text-[#555555]"}`}
                    >
                        {value || placeholder}
                    </span>
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
                        className={`flex w-full items-center justify-between px-4 py-4 ${
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

const INCOME_SOURCES = ["راتب حكومي", "راتب خاص", "أعمال حرة", "تجارة", "أخرى"];
const SALARY_DAYS = [
    "أول الشهر",
    "الخامس",
    "العاشر",
    "الخامس عشر",
    "العشرون",
    "الخامس والعشرون",
    "نهاية الشهر",
];

interface IncomeStepProps {
    data: WalletFormData;
    onChange: (updates: Partial<WalletFormData>) => void;
    onNext: () => void;
}

export function IncomeStep({ data, onChange, onNext }: IncomeStepProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            onChange({ uploadedDoc: { file, previewName: file.name } });
        }
        e.target.value = "";
    };

    return (
        <div className="flex flex-col gap-4 pb-6">
            {/* Income Source Card */}
            <div className="rounded-2xl bg-[#F6F5F8] p-4">
                <h2 className="mb-4 text-center text-[16px] font-bold text-[#555555]">
                    مصدر الدخل
                </h2>
                <div className="flex flex-col gap-4 rounded-2xl bg-white p-4 shadow-[0px_4px_8.9px_rgba(0,0,0,0.03)]">
                    <WDropdown
                        label="اختر مصدر الدخل الرئيسي"
                        required
                        value={data.incomeSource}
                        options={INCOME_SOURCES}
                        placeholder="اختر مصدر الدخل الرئيسي"
                        onChange={(v) => onChange({ incomeSource: v })}
                    />

                    <WField label="اسم جهة العمل" required>
                        <input
                            className={inputCls}
                            placeholder="اسم جهة العمل"
                            value={data.employerName}
                            onChange={(e) => onChange({ employerName: e.target.value })}
                            dir="rtl"
                        />
                    </WField>

                    <WField label="الدخل الشهري" required>
                        <input
                            className={inputCls}
                            placeholder="اسم العائلة"
                            value={data.monthlyIncome}
                            onChange={(e) => onChange({ monthlyIncome: e.target.value })}
                            dir="rtl"
                        />
                    </WField>

                    <WDropdown
                        label="ما هو يوم استلام راتبك"
                        required
                        value={data.salaryDay}
                        options={SALARY_DAYS}
                        placeholder="اختر اليوم"
                        onChange={(v) => onChange({ salaryDay: v })}
                    />

                    <WRadioGroup
                        label="هل لديك أي أقساط؟"
                        options={["نعم", "لا"]}
                        value={data.hasInstallments}
                        onChange={(v) => onChange({ hasInstallments: v })}
                    />
                </div>
            </div>

            {/* Documents Card */}
            <div className="rounded-2xl bg-[#F6F5F8] p-4">
                <div className="flex flex-col gap-3 rounded-2xl bg-white p-4 shadow-[0px_4px_8.9px_rgba(0,0,0,0.03)]">
                    <p className="text-end text-[14px] font-medium leading-relaxed text-[#000000]">
                        أرفق صوراً واضحة لمستنداتك مثل الهوية أو عقد الإيجار، وسم كل ملف قبل رفعه
                    </p>

                    {data.uploadedDoc ? (
                        <div className="flex items-center gap-3 rounded-xl border border-[#30913F]/30 bg-[#E8F5E9] px-4 py-3">
                            <button
                                type="button"
                                onClick={() => onChange({ uploadedDoc: null })}
                                className="text-[13px] font-medium text-red-500"
                            >
                                حذف
                            </button>
                            <span className="min-w-0 flex-1 truncate text-end text-[14px] font-semibold text-[#111B18]">
                                {data.uploadedDoc.previewName}
                            </span>
                            <FileText className="h-5 w-5 shrink-0 text-[#30913F]" />
                        </div>
                    ) : (
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="flex w-full items-center gap-3 rounded-xl border border-dashed border-[#C6C8CE] bg-white px-4 py-4 transition-colors active:bg-gray-50"
                        >
                            <div className="flex min-w-0 flex-1 flex-col items-end gap-0.5">
                                <span className="text-[14px] font-bold text-[#000000]">
                                    اختر ملفاً وأضفه
                                </span>
                                <span className="text-end text-[12px] font-medium text-[#000000]">
                                    برجاء التأكد أن الحد أقصى 5 ميجا pdf, jpg, png
                                </span>
                            </div>
                            <FileText
                                className="h-6 w-6 shrink-0 text-[#111B18]"
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
                    className="h-12 w-full rounded-xl bg-[#30913F] text-[16px] font-bold text-white active:bg-[#267332]"
                >
                    التالي
                </button>
            </div>
        </div>
    );
}

"use client";

import { FileUploadZone } from "@/features/profile/components/shared/registration/FileUploadZone";
import { FormAlert } from "@/features/profile/components/shared/registration/FormAlert";
import {
    FormField,
    sectionTitleClass,
} from "@/features/profile/components/shared/registration/FormField";
import type { QidhaFieldErrors } from "@/features/profile/lib/qidha-subscription-validation";
import type { WalletFormData } from "../types";
import {
    FieldError,
    RadioField,
    SelectField,
    TextInput,
} from "../shared/FormControls";

const INCOME_SOURCES = [
    "راتب حكومي",
    "راتب خاص",
    "أعمال حرة",
    "تجارة",
    "أخرى",
] as const;

const SALARY_DAYS = [
    "أول الشهر",
    "الخامس",
    "العاشر",
    "الخامس عشر",
    "العشرون",
    "الخامس والعشرون",
    "نهاية الشهر",
] as const;

interface IncomeStepProps {
    data: WalletFormData;
    errors: QidhaFieldErrors;
    onChange: (updates: Partial<WalletFormData>) => void;
    onSubmit: () => void;
    formId: string;
}

export function IncomeStep({
    data,
    errors,
    onChange,
    onSubmit,
    formId,
}: IncomeStepProps) {
    return (
        <form
            id={formId}
            noValidate
            onSubmit={(e) => {
                e.preventDefault();
                onSubmit();
            }}
            className="flex flex-col gap-5 pb-4"
        >
            {errors.general && (
                <FormAlert tone="error" message={errors.general} />
            )}

            <section className="rounded-2xl bg-[#F6F5F8] p-3 dark:bg-gray-800/40 sm:p-4">
                <h2 className={`${sectionTitleClass} text-center text-[#555555] dark:text-gray-400`}>
                    مصدر الدخل
                </h2>
                <div className="grid grid-cols-1 gap-4 rounded-2xl bg-white p-3 shadow-[0px_4px_8.9px_rgba(0,0,0,0.03)] dark:bg-gray-900 sm:p-4 md:grid-cols-2">
                    <SelectField
                        fieldId="field-incomeSource"
                        label="مصدر الدخل الرئيسي"
                        required
                        value={data.incomeSource}
                        options={INCOME_SOURCES}
                        placeholder="اختر مصدر الدخل"
                        error={errors.incomeSource}
                        onChange={(incomeSource) => onChange({ incomeSource })}
                    />
                    <TextInput
                        fieldId="field-employerName"
                        name="employerName"
                        label="اسم جهة العمل"
                        required
                        value={data.employerName}
                        placeholder="اسم جهة العمل"
                        error={errors.employerName}
                        onChange={(employerName) => onChange({ employerName })}
                    />
                    <TextInput
                        fieldId="field-monthlyIncome"
                        name="monthlyIncome"
                        label="الدخل الشهري"
                        required
                        type="number"
                        inputMode="decimal"
                        dir="ltr"
                        value={data.monthlyIncome}
                        placeholder="مثال: 8000"
                        error={errors.monthlyIncome}
                        onChange={(monthlyIncome) => onChange({ monthlyIncome })}
                    />
                    <SelectField
                        fieldId="field-salaryDay"
                        label="يوم استلام الراتب"
                        required
                        value={data.salaryDay}
                        options={SALARY_DAYS}
                        placeholder="اختر اليوم"
                        error={errors.salaryDay}
                        onChange={(salaryDay) => onChange({ salaryDay })}
                    />
                    <div className="md:col-span-2">
                        <RadioField
                            fieldId="field-hasInstallments"
                            label="هل لديك أي أقساط؟"
                            required
                            options={["نعم", "لا"]}
                            value={data.hasInstallments}
                            error={errors.hasInstallments}
                            onChange={(hasInstallments) => onChange({ hasInstallments })}
                        />
                    </div>
                </div>
            </section>

            <section className="rounded-2xl bg-[#F6F5F8] p-3 dark:bg-gray-800/40 sm:p-4">
                <h2 className={`${sectionTitleClass} text-center text-[#555555] dark:text-gray-400`}>
                    المستندات
                </h2>
                <div className="rounded-2xl bg-white p-3 shadow-[0px_4px_8.9px_rgba(0,0,0,0.03)] dark:bg-gray-900 sm:p-4">
                    <FormField label="إرفاق مستند" required>
                        <div
                            id="field-uploadedDoc"
                            data-error={errors.uploadedDoc ? "true" : undefined}
                            className={
                                errors.uploadedDoc
                                    ? "rounded-2xl ring-1 ring-[#DB2626]"
                                    : undefined
                            }
                        >
                            <FileUploadZone
                                title="اختر ملفاً وأضفه"
                                helperText="الحد الأقصى 5 ميجا — PDF أو JPG أو PNG"
                                variant="document"
                                accept="image/*,.pdf,application/pdf"
                                uploaded={data.uploadedDoc}
                                onSelect={(file) =>
                                    onChange({
                                        uploadedDoc: {
                                            file,
                                            previewName: file.name,
                                        },
                                    })
                                }
                                onRemove={() => onChange({ uploadedDoc: null })}
                            />
                        </div>
                        <FieldError
                            message={errors.uploadedDoc}
                            id="field-uploadedDoc-error"
                        />
                    </FormField>
                </div>
            </section>
        </form>
    );
}

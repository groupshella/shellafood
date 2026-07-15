"use client";

import { FormAlert } from "@/features/profile/components/shared/registration/FormAlert";
import { PhoneField } from "@/features/profile/components/shared/registration/PhoneInput";
import {
    FormField,
    sectionTitleClass,
} from "@/features/profile/components/shared/registration/FormField";
import type { QidhaFieldErrors } from "@/features/profile/lib/qidha-subscription-validation";
import type { WalletFormData } from "../types";
import {
    DateInput,
    FieldError,
    RadioField,
    SelectField,
    TextInput,
} from "../shared/FormControls";

const NATIONALITY_OPTIONS = ["سعودي", "مصري", "كويتي", "إماراتي", "أردني"] as const;
const MARITAL_OPTIONS = ["أعزب", "متزوج", "مطلق"] as const;
const HOME_TYPE_OPTIONS = ["منزل", "شقة", "فيلا"] as const;
const CITY_OPTIONS = [
    "الرياض",
    "جدة",
    "مكة المكرمة",
    "المدينة المنورة",
    "الدمام",
    "الخبر",
] as const;

interface PersonalInfoStepProps {
    data: WalletFormData;
    errors: QidhaFieldErrors;
    onChange: (updates: Partial<WalletFormData>) => void;
    onSubmit: () => void;
    formId: string;
}

export function PersonalInfoStep({
    data,
    errors,
    onChange,
    onSubmit,
    formId,
}: PersonalInfoStepProps) {
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
                    المعلومات الشخصية
                </h2>
                <div className="grid grid-cols-1 gap-4 rounded-2xl bg-white p-3 shadow-[0px_4px_8.9px_rgba(0,0,0,0.03)] dark:bg-gray-900 sm:p-4 md:grid-cols-2">
                    <TextInput
                        fieldId="field-firstName"
                        name="firstName"
                        label="الاسم الأول"
                        required
                        value={data.firstName}
                        placeholder="الاسم الأول"
                        autoComplete="given-name"
                        error={errors.firstName}
                        onChange={(firstName) => onChange({ firstName })}
                    />
                    <TextInput
                        fieldId="field-fatherName"
                        name="fatherName"
                        label="اسم الأب"
                        required
                        value={data.fatherName}
                        placeholder="اسم الأب"
                        error={errors.fatherName}
                        onChange={(fatherName) => onChange({ fatherName })}
                    />
                    <TextInput
                        fieldId="field-grandfatherName"
                        name="grandfatherName"
                        label="اسم الجد"
                        value={data.grandfatherName}
                        placeholder="اسم الجد"
                        error={errors.grandfatherName}
                        onChange={(grandfatherName) => onChange({ grandfatherName })}
                    />
                    <TextInput
                        fieldId="field-familyName"
                        name="familyName"
                        label="اسم العائلة"
                        required
                        value={data.familyName}
                        placeholder="اسم العائلة"
                        autoComplete="family-name"
                        error={errors.familyName}
                        onChange={(familyName) => onChange({ familyName })}
                    />
                    <DateInput
                        fieldId="field-birthDate"
                        name="birthDate"
                        label="تاريخ الميلاد"
                        required
                        value={data.birthDate}
                        error={errors.birthDate}
                        onChange={(birthDate) => onChange({ birthDate })}
                    />
                    <SelectField
                        fieldId="field-nationality"
                        label="الجنسية"
                        required
                        value={data.nationality}
                        options={NATIONALITY_OPTIONS}
                        placeholder="اختر الجنسية"
                        error={errors.nationality}
                        onChange={(nationality) => onChange({ nationality })}
                        extra={
                            data.nationality === "سعودي" ? (
                                <span className="text-lg leading-none" aria-hidden>
                                    🇸🇦
                                </span>
                            ) : null
                        }
                    />
                    <div className="md:col-span-2">
                        <RadioField
                            fieldId="field-maritalStatus"
                            label="الحالة الاجتماعية"
                            required
                            options={MARITAL_OPTIONS}
                            value={data.maritalStatus}
                            error={errors.maritalStatus}
                            onChange={(maritalStatus) => onChange({ maritalStatus })}
                        />
                    </div>
                    <TextInput
                        fieldId="field-familyCount"
                        name="familyCount"
                        label="عدد أفراد الأسرة"
                        required
                        type="number"
                        inputMode="numeric"
                        dir="ltr"
                        value={data.familyCount}
                        placeholder="مثال: 4"
                        error={errors.familyCount}
                        onChange={(familyCount) => onChange({ familyCount })}
                    />
                    <TextInput
                        fieldId="field-idNumber"
                        name="idNumber"
                        label="رقم الهوية / بطاقة الأحوال"
                        required
                        dir="ltr"
                        inputMode="numeric"
                        value={data.idNumber}
                        placeholder="10 أرقام"
                        error={errors.idNumber}
                        onChange={(idNumber) => onChange({ idNumber })}
                    />
                    <DateInput
                        fieldId="field-idExpiryDate"
                        name="idExpiryDate"
                        label="تاريخ انتهاء الهوية"
                        required
                        value={data.idExpiryDate}
                        error={errors.idExpiryDate}
                        onChange={(idExpiryDate) => onChange({ idExpiryDate })}
                    />
                    <FormField label="رقم الجوال" required>
                        <div
                            id="field-phone"
                            data-error={errors.phone ? "true" : undefined}
                            className={
                                errors.phone
                                    ? "rounded-xl ring-1 ring-[#DB2626]"
                                    : undefined
                            }
                        >
                            <PhoneField
                                value={data.phone}
                                onChange={(phone) => onChange({ phone })}
                                placeholder="5x xxx xxxx"
                            />
                        </div>
                        <FieldError message={errors.phone} id="field-phone-error" />
                    </FormField>
                </div>
            </section>

            <section className="rounded-2xl bg-[#F6F5F8] p-3 dark:bg-gray-800/40 sm:p-4">
                <h2 className={`${sectionTitleClass} text-center text-[#555555] dark:text-gray-400`}>
                    بيانات السكن
                </h2>
                <div className="grid grid-cols-1 gap-4 rounded-2xl bg-white p-3 shadow-[0px_4px_8.9px_rgba(0,0,0,0.03)] dark:bg-gray-900 sm:p-4 md:grid-cols-2">
                    <div className="md:col-span-2">
                        <RadioField
                            fieldId="field-homeType"
                            label="نوع المنزل"
                            required
                            options={HOME_TYPE_OPTIONS}
                            value={data.homeType}
                            error={errors.homeType}
                            onChange={(homeType) => onChange({ homeType })}
                        />
                    </div>
                    <SelectField
                        fieldId="field-city"
                        label="المدينة"
                        required
                        value={data.city}
                        options={CITY_OPTIONS}
                        placeholder="اختر المدينة"
                        error={errors.city}
                        onChange={(city) => onChange({ city })}
                    />
                    <TextInput
                        fieldId="field-neighborhood"
                        name="neighborhood"
                        label="الحي"
                        required
                        value={data.neighborhood}
                        placeholder="اسم الحي"
                        error={errors.neighborhood}
                        onChange={(neighborhood) => onChange({ neighborhood })}
                    />
                </div>
            </section>
        </form>
    );
}

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

const NATIONALITY_OPTIONS = [
	{ value: "سعودي", label: { ar: "سعودي", en: "Saudi" } },
	{ value: "مصري", label: { ar: "مصري", en: "Egyptian" } },
	{ value: "كويتي", label: { ar: "كويتي", en: "Kuwaiti" } },
	{ value: "إماراتي", label: { ar: "إماراتي", en: "Emirati" } },
	{ value: "أردني", label: { ar: "أردني", en: "Jordanian" } },
] as const;

const MARITAL_OPTIONS = [
	{ value: "أعزب", label: { ar: "أعزب", en: "Single" } },
	{ value: "متزوج", label: { ar: "متزوج", en: "Married" } },
	{ value: "مطلق", label: { ar: "مطلق", en: "Divorced" } },
] as const;

const HOME_TYPE_OPTIONS = [
	{ value: "منزل", label: { ar: "منزل", en: "House" } },
	{ value: "شقة", label: { ar: "شقة", en: "Apartment" } },
	{ value: "فيلا", label: { ar: "فيلا", en: "Villa" } },
] as const;

const CITY_OPTIONS = [
	{ value: "الرياض", label: { ar: "الرياض", en: "Riyadh" } },
	{ value: "جدة", label: { ar: "جدة", en: "Jeddah" } },
	{ value: "مكة المكرمة", label: { ar: "مكة المكرمة", en: "Makkah" } },
	{
		value: "المدينة المنورة",
		label: { ar: "المدينة المنورة", en: "Madinah" },
	},
	{ value: "الدمام", label: { ar: "الدمام", en: "Dammam" } },
	{ value: "الخبر", label: { ar: "الخبر", en: "Khobar" } },
] as const;

interface PersonalInfoStepProps {
	data: WalletFormData;
	errors: QidhaFieldErrors;
	onChange: (updates: Partial<WalletFormData>) => void;
	onSubmit: () => void;
	formId: string;
	isArabic: boolean;
}

export function PersonalInfoStep({
	data,
	errors,
	onChange,
	onSubmit,
	formId,
	isArabic,
}: PersonalInfoStepProps) {
	const nameDir = isArabic ? "rtl" : "ltr";

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

			<section className="rounded-2xl bg-background p-3 sm:p-4">
				<h2 className={`${sectionTitleClass} text-center text-muted`}>
					{isArabic ? "المعلومات الشخصية" : "Personal information"}
				</h2>
				<div className="grid grid-cols-1 gap-4 rounded-2xl bg-card p-3 shadow-[0px_4px_8.9px_rgba(0,0,0,0.03)] sm:p-4 md:grid-cols-2">
					<TextInput
						fieldId="field-firstName"
						name="firstName"
						label={isArabic ? "الاسم الأول" : "First name"}
						required
						value={data.firstName}
						placeholder={isArabic ? "الاسم الأول" : "First name"}
						autoComplete="given-name"
						dir={nameDir}
						error={errors.firstName}
						onChange={(firstName) => onChange({ firstName })}
					/>
					<TextInput
						fieldId="field-fatherName"
						name="fatherName"
						label={isArabic ? "اسم الأب" : "Father's name"}
						required
						value={data.fatherName}
						placeholder={isArabic ? "اسم الأب" : "Father's name"}
						dir={nameDir}
						error={errors.fatherName}
						onChange={(fatherName) => onChange({ fatherName })}
					/>
					<TextInput
						fieldId="field-grandfatherName"
						name="grandfatherName"
						label={isArabic ? "اسم الجد" : "Grandfather's name"}
						value={data.grandfatherName}
						placeholder={isArabic ? "اسم الجد" : "Grandfather's name"}
						dir={nameDir}
						error={errors.grandfatherName}
						onChange={(grandfatherName) => onChange({ grandfatherName })}
					/>
					<TextInput
						fieldId="field-familyName"
						name="familyName"
						label={isArabic ? "اسم العائلة" : "Family name"}
						required
						value={data.familyName}
						placeholder={isArabic ? "اسم العائلة" : "Family name"}
						autoComplete="family-name"
						dir={nameDir}
						error={errors.familyName}
						onChange={(familyName) => onChange({ familyName })}
					/>
					<DateInput
						fieldId="field-birthDate"
						name="birthDate"
						label={isArabic ? "تاريخ الميلاد" : "Date of birth"}
						required
						value={data.birthDate}
						error={errors.birthDate}
						onChange={(birthDate) => onChange({ birthDate })}
					/>
					<SelectField
						fieldId="field-nationality"
						label={isArabic ? "الجنسية" : "Nationality"}
						required
						value={data.nationality}
						options={NATIONALITY_OPTIONS.map((o) => ({
							value: o.value,
							label: isArabic ? o.label.ar : o.label.en,
						}))}
						placeholder={
							isArabic ? "اختر الجنسية" : "Select nationality"
						}
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
							label={isArabic ? "الحالة الاجتماعية" : "Marital status"}
							required
							options={MARITAL_OPTIONS.map((o) => ({
								value: o.value,
								label: isArabic ? o.label.ar : o.label.en,
							}))}
							value={data.maritalStatus}
							error={errors.maritalStatus}
							onChange={(maritalStatus) => onChange({ maritalStatus })}
						/>
					</div>
					<TextInput
						fieldId="field-familyCount"
						name="familyCount"
						label={isArabic ? "عدد أفراد الأسرة" : "Family members"}
						required
						type="number"
						inputMode="numeric"
						dir="ltr"
						value={data.familyCount}
						placeholder={isArabic ? "مثال: 4" : "e.g. 4"}
						error={errors.familyCount}
						onChange={(familyCount) => onChange({ familyCount })}
					/>
					<TextInput
						fieldId="field-idNumber"
						name="idNumber"
						label={
							isArabic
								? "رقم الهوية / بطاقة الأحوال"
								: "National ID number"
						}
						required
						dir="ltr"
						inputMode="numeric"
						value={data.idNumber}
						placeholder={isArabic ? "10 أرقام" : "10 digits"}
						error={errors.idNumber}
						onChange={(idNumber) => onChange({ idNumber })}
					/>
					<DateInput
						fieldId="field-idExpiryDate"
						name="idExpiryDate"
						label={isArabic ? "تاريخ انتهاء الهوية" : "ID expiry date"}
						required
						value={data.idExpiryDate}
						error={errors.idExpiryDate}
						onChange={(idExpiryDate) => onChange({ idExpiryDate })}
					/>
					<FormField
						label={isArabic ? "رقم الجوال" : "Mobile number"}
						required
					>
						<div
							id="field-phone"
							data-error={errors.phone ? "true" : undefined}
							className={
								errors.phone
									? "rounded-xl ring-1 ring-red-500"
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

			<section className="rounded-2xl bg-background p-3 sm:p-4">
				<h2 className={`${sectionTitleClass} text-center text-muted`}>
					{isArabic ? "بيانات السكن" : "Housing details"}
				</h2>
				<div className="grid grid-cols-1 gap-4 rounded-2xl bg-card p-3 shadow-[0px_4px_8.9px_rgba(0,0,0,0.03)] sm:p-4 md:grid-cols-2">
					<div className="md:col-span-2">
						<RadioField
							fieldId="field-homeType"
							label={isArabic ? "نوع المنزل" : "Home type"}
							required
							options={HOME_TYPE_OPTIONS.map((o) => ({
								value: o.value,
								label: isArabic ? o.label.ar : o.label.en,
							}))}
							value={data.homeType}
							error={errors.homeType}
							onChange={(homeType) => onChange({ homeType })}
						/>
					</div>
					<SelectField
						fieldId="field-city"
						label={isArabic ? "المدينة" : "City"}
						required
						value={data.city}
						options={CITY_OPTIONS.map((o) => ({
							value: o.value,
							label: isArabic ? o.label.ar : o.label.en,
						}))}
						placeholder={isArabic ? "اختر المدينة" : "Select city"}
						error={errors.city}
						onChange={(city) => onChange({ city })}
					/>
					<TextInput
						fieldId="field-neighborhood"
						name="neighborhood"
						label={isArabic ? "الحي" : "Neighborhood"}
						required
						value={data.neighborhood}
						placeholder={isArabic ? "اسم الحي" : "Neighborhood name"}
						dir={nameDir}
						error={errors.neighborhood}
						onChange={(neighborhood) => onChange({ neighborhood })}
					/>
				</div>
			</section>
		</form>
	);
}

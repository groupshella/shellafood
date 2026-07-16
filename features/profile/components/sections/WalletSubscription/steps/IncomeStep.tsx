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
	{ value: "راتب حكومي", label: { ar: "راتب حكومي", en: "Government salary" } },
	{ value: "راتب خاص", label: { ar: "راتب خاص", en: "Private sector salary" } },
	{ value: "أعمال حرة", label: { ar: "أعمال حرة", en: "Freelance" } },
	{ value: "تجارة", label: { ar: "تجارة", en: "Business" } },
	{ value: "أخرى", label: { ar: "أخرى", en: "Other" } },
] as const;

const SALARY_DAYS = [
	{ value: "أول الشهر", label: { ar: "أول الشهر", en: "1st of the month" } },
	{ value: "الخامس", label: { ar: "الخامس", en: "5th" } },
	{ value: "العاشر", label: { ar: "العاشر", en: "10th" } },
	{ value: "الخامس عشر", label: { ar: "الخامس عشر", en: "15th" } },
	{ value: "العشرون", label: { ar: "العشرون", en: "20th" } },
	{
		value: "الخامس والعشرون",
		label: { ar: "الخامس والعشرون", en: "25th" },
	},
	{ value: "نهاية الشهر", label: { ar: "نهاية الشهر", en: "End of month" } },
] as const;

const YES_NO_OPTIONS = [
	{ value: "نعم", label: { ar: "نعم", en: "Yes" } },
	{ value: "لا", label: { ar: "لا", en: "No" } },
] as const;

interface IncomeStepProps {
	data: WalletFormData;
	errors: QidhaFieldErrors;
	onChange: (updates: Partial<WalletFormData>) => void;
	onSubmit: () => void;
	formId: string;
	isArabic: boolean;
}

export function IncomeStep({
	data,
	errors,
	onChange,
	onSubmit,
	formId,
	isArabic,
}: IncomeStepProps) {
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
					{isArabic ? "مصدر الدخل" : "Income source"}
				</h2>
				<div className="grid grid-cols-1 gap-4 rounded-2xl bg-card p-3 shadow-[0px_4px_8.9px_rgba(0,0,0,0.03)] sm:p-4 md:grid-cols-2">
					<SelectField
						fieldId="field-incomeSource"
						label={
							isArabic ? "مصدر الدخل الرئيسي" : "Primary income source"
						}
						required
						value={data.incomeSource}
						options={INCOME_SOURCES.map((o) => ({
							value: o.value,
							label: isArabic ? o.label.ar : o.label.en,
						}))}
						placeholder={
							isArabic ? "اختر مصدر الدخل" : "Select income source"
						}
						error={errors.incomeSource}
						onChange={(incomeSource) => onChange({ incomeSource })}
					/>
					<TextInput
						fieldId="field-employerName"
						name="employerName"
						label={isArabic ? "اسم جهة العمل" : "Employer name"}
						required
						value={data.employerName}
						placeholder={isArabic ? "اسم جهة العمل" : "Employer name"}
						dir={nameDir}
						error={errors.employerName}
						onChange={(employerName) => onChange({ employerName })}
					/>
					<TextInput
						fieldId="field-monthlyIncome"
						name="monthlyIncome"
						label={isArabic ? "الدخل الشهري" : "Monthly income"}
						required
						type="number"
						inputMode="decimal"
						dir="ltr"
						value={data.monthlyIncome}
						placeholder={isArabic ? "مثال: 8000" : "e.g. 8000"}
						error={errors.monthlyIncome}
						onChange={(monthlyIncome) => onChange({ monthlyIncome })}
					/>
					<SelectField
						fieldId="field-salaryDay"
						label={isArabic ? "يوم استلام الراتب" : "Salary day"}
						required
						value={data.salaryDay}
						options={SALARY_DAYS.map((o) => ({
							value: o.value,
							label: isArabic ? o.label.ar : o.label.en,
						}))}
						placeholder={isArabic ? "اختر اليوم" : "Select day"}
						error={errors.salaryDay}
						onChange={(salaryDay) => onChange({ salaryDay })}
					/>
					<div className="md:col-span-2">
						<RadioField
							fieldId="field-hasInstallments"
							label={
								isArabic
									? "هل لديك أي أقساط؟"
									: "Do you have any installments?"
							}
							required
							options={YES_NO_OPTIONS.map((o) => ({
								value: o.value,
								label: isArabic ? o.label.ar : o.label.en,
							}))}
							value={data.hasInstallments}
							error={errors.hasInstallments}
							onChange={(hasInstallments) =>
								onChange({ hasInstallments })
							}
						/>
					</div>
				</div>
			</section>

			<section className="rounded-2xl bg-background p-3 sm:p-4">
				<h2 className={`${sectionTitleClass} text-center text-muted`}>
					{isArabic ? "المستندات" : "Documents"}
				</h2>
				<div className="rounded-2xl bg-card p-3 shadow-[0px_4px_8.9px_rgba(0,0,0,0.03)] sm:p-4">
					<FormField
						label={isArabic ? "إرفاق مستند" : "Attach document"}
						required
					>
						<div
							id="field-uploadedDoc"
							data-error={errors.uploadedDoc ? "true" : undefined}
							className={
								errors.uploadedDoc
									? "rounded-2xl ring-1 ring-red-500"
									: undefined
							}
						>
							<FileUploadZone
								title={
									isArabic
										? "اختر ملفاً وأضفه"
										: "Choose a file and upload"
								}
								helperText={
									isArabic
										? "الحد الأقصى 5 ميجا — PDF أو JPG أو PNG"
										: "Max 5 MB — PDF, JPG, or PNG"
								}
								variant="document"
								accept="image/*,.pdf,application/pdf"
								uploaded={data.uploadedDoc}
								isArabic={isArabic}
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

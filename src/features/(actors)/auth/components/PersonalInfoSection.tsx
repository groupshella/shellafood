'use client';
import React from "react";
import { FormInput, PhoneInput, SectionHeader } from "@/shared/components";

interface PersonalInfoSectionProps {
	first_name: string;
	last_name: string;
	phone: string;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	onPhoneChange: (phone: string) => void;
	isArabic: boolean;
	t: (key: string) => string;
	disabled?: boolean;
	errors?: {
		first_name?: string;
		last_name?: string;
		phone?: string;
	};
}

/**
 * Personal Information Section
 * First name, last name, phone number
 */
export const PersonalInfoSection: React.FC<PersonalInfoSectionProps> = ({
	first_name,
	last_name,
	phone,
	onChange,
	onPhoneChange,
	isArabic,
	t,	
	errors,
	disabled = false,
}) => {
	return (
		<div>
			<SectionHeader
				title={t("register.personalInfo")}
				isArabic={isArabic}
			/>

			<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
				{/* First Name */}
				<FormInput
					label={isArabic ? "الاسم الأول" : "First Name"}
					name="first_name"
					value={first_name}
					onChange={onChange}
					placeholder={isArabic ? "أدخل الاسم الأول" : "Enter first name"}
					required
					isArabic={isArabic}
					error={errors?.first_name}
					disabled={disabled}
				/>

				{/* Last Name */}
				<FormInput
					label={isArabic ? "اسم العائلة" : "Last Name"}
					name="last_name"
					value={last_name}
					onChange={onChange}
					placeholder={isArabic ? "أدخل اسم العائلة" : "Enter last name"}
					required
					isArabic={isArabic}
					error={errors?.last_name}
					disabled={disabled}
				/>

				{/* Phone Number */}
				<PhoneInput
					label={t("register.phoneNumber")}
					value={phone}
					onChange={onPhoneChange}
					isArabic={isArabic}
					required
					name="phone"
					error={errors?.phone}
					disabled={disabled}
				/>
			</div>
		</div>
	);
};

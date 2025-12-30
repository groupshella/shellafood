'use client';
import React from "react";
import { FormInput, PasswordInput, SectionHeader } from "@/shared/components";
import Link from 'next/link';

interface AccountSectionProps {
	email: string;
	password: string;
	password_confirmation: string;
	accept_terms: boolean;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	isArabic: boolean;
	t: (key: string) => string;
	disabled?: boolean;
	errors?: {
		email?: string;
		password?: string;
		password_confirmation?: string;
		accept_terms?: string;
	};
}

/**
 * Account Section
 * Email, password, confirm password, terms checkbox
 */
export const AccountSection: React.FC<AccountSectionProps> = ({
	email,
	password,
	password_confirmation,
	accept_terms,
	onChange,
	isArabic,
	t,
	errors,
	disabled = false,
}) => {
	return (
		<div>
			<SectionHeader
				title={t("register.accountInfo")}
				isArabic={isArabic}
			/>

			<div className="grid grid-cols-1 gap-6">
				{/* Email */}
				<FormInput
					label={t("register.email")}
					name="email"
					type="email"
					value={email}
					onChange={onChange}
					placeholder={isArabic ? "example@email.com" : "example@email.com"}
					isArabic={isArabic}
					error={errors?.email}
					disabled={disabled}
				/>

				<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
					{/* Password */}
					<PasswordInput
						label={t("register.password")}
						name="password"
						value={password}
						onChange={onChange}
						placeholder={isArabic ? "أدخل كلمة المرور" : "Enter password"}
						required
						isArabic={isArabic}
						error={errors?.password}
						disabled={disabled}
					/>

					{/* Confirm Password */}
					<PasswordInput
						label={t("register.confirmPassword")}
						name="password_confirmation"
						value={password_confirmation}
						onChange={onChange}
						placeholder={isArabic ? "أعد إدخال كلمة المرور" : "Re-enter password"}
						required
						isArabic={isArabic}
						error={errors?.password_confirmation}
						disabled={disabled}
					/>
				</div>

				{/* Terms Checkbox */}
				<div>
					<label className="flex items-start">
						<input
							type="checkbox"
							name="accept_terms"
							checked={accept_terms}
							onChange={onChange}
							className="mt-1 rounded border-gray-300 text-green-600 focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600"
							disabled={disabled}
						/>
						<span className="mr-2 text-sm text-gray-600 dark:text-gray-300">
							{isArabic ? (
								<>
									أوافق على{' '}
									<Link href="/terms" className="text-green-600 dark:text-green-400 hover:underline">
										الشروط والأحكام
									</Link>
									{' '}و{' '}
									<Link href="/privacy" className="text-green-600 dark:text-green-400 hover:underline">
										سياسة الخصوصية
									</Link>
								</>
							) : (
								<>
									I agree to the{' '}
									<Link href="/terms" className="text-green-600 dark:text-green-400 hover:underline">
										Terms and Conditions
									</Link>
									{' '}and{' '}
									<Link href="/privacy" className="text-green-600 dark:text-green-400 hover:underline">
										Privacy Policy
									</Link>
								</>
							)}
						</span>
					</label>
					{errors?.accept_terms && (
						<p className="text-red-500 text-sm mt-1">{errors.accept_terms}</p>
					)}
				</div>
			</div>
		</div>
	);
};

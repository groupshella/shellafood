"use client";

import React from "react";

export interface FormSelectProps {
	label: string;
	name: string;
	options: { value: string; label: string }[];
	value: string;
	onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
	required?: boolean;
	isArabic?: boolean;
	placeholder?: string;
	className?: string;
	error?: string;
	ref?: React.RefObject<HTMLSelectElement>;
	disabled?: boolean;
	helperText?: string;
}

/**
 * Reusable Form Select Component
 * Consistent dropdown field with label and styling
 */
export const FormSelect: React.FC<FormSelectProps> = ({
	label,
	name,
	options,
	value,
	onChange,
	required = false,
	isArabic = true,
	placeholder,
	className = "",
	error,
	disabled = false,
	helperText,
	ref,
}) => {
	const defaultPlaceholder = placeholder || (isArabic ? "-- اختر --" : "-- Choose --");

	return (
		<div className={`flex flex-col space-y-2 ${className}`}>
			<label
				htmlFor={name}
				className={`text-sm font-semibold text-gray-700  md:text-base ${isArabic ? "text-right" : "text-left"}`}
			>
				{label}
				{required && <span className="text-red-500  mr-1">*</span>}
			</label>
			<select
				ref={ref}
				id={name}
				name={name}
				value={value}
				onChange={onChange}
				required={required}
				disabled={disabled}
				className={`rounded-lg border border-gray-300  bg-white p-3 text-gray-900  shadow-sm transition-all duration-200 focus:border-green-500  focus:ring-2 focus:ring-green-500/20 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-100  ${
					isArabic ? "text-right" : "text-left"
				}`}
			>
				<option value="">{defaultPlaceholder}</option>
				{options.map((option) => (
					<option key={option.value} value={option.value}>
						{option.label}
					</option>
				))}
			</select>
			{error && (
				<p className={`text-sm text-red-500 ${isArabic ? "text-right" : "text-left"}`}>
					{error}
				</p>
			)}
			{helperText && !error && (
				<p className={`text-xs text-gray-500  ${isArabic ? "text-right" : "text-left"}`}>
					{helperText}
				</p>
			)}
		</div>
	);
};


"use client";

import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { inputClassName } from "./FormField";

interface PasswordInputProps {
	value: string;
	onChange: (value: string) => void;
	placeholder?: string;
	hasError?: boolean;
	disabled?: boolean;
	isArabic?: boolean;
}

export function PasswordInput({
	value,
	onChange,
	placeholder,
	hasError,
	disabled = false,
	isArabic = true,
}: PasswordInputProps) {
	const [visible, setVisible] = useState(false);

	return (
		<div className="relative" dir="ltr" aria-invalid={hasError || undefined}>
			<input
				type={visible ? "text" : "password"}
				value={value}
				onChange={(e) => onChange(e.target.value)}
				placeholder={placeholder}
				disabled={disabled}
				aria-invalid={!!hasError}
				className={`${inputClassName} text-end ${
					hasError
						? "border-red-500 focus:border-red-500 focus:ring-red-500/10"
						: ""
				} ${disabled ? "cursor-not-allowed bg-card opacity-80" : ""}`}
				autoComplete="new-password"
				aria-required
			/>
			<button
				type="button"
				onClick={() => setVisible((v) => !v)}
				disabled={disabled}
				className="absolute inset-y-0 start-3 flex h-full min-w-[44px] items-center justify-center text-muted transition-colors active:text-foreground disabled:opacity-50"
				aria-label={
					visible
						? isArabic
							? "إخفاء كلمة المرور"
							: "Hide password"
						: isArabic
							? "إظهار كلمة المرور"
							: "Show password"
				}
			>
				{visible ? (
					<Eye className="h-5 w-5" strokeWidth={1.5} />
				) : (
					<EyeOff className="h-5 w-5" strokeWidth={1.5} />
				)}
			</button>
		</div>
	);
}

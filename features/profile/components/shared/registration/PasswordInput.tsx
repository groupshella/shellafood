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
}

export function PasswordInput({
    value,
    onChange,
    placeholder,
    hasError,
    disabled = false,
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
                        ? "border-[#DB2626] focus:border-[#DB2626] focus:ring-red-100 dark:focus:ring-red-900/30"
                        : ""
                } ${disabled ? "cursor-not-allowed bg-gray-50 opacity-80 dark:bg-gray-800/60" : ""}`}
                autoComplete="new-password"
                aria-required
            />
            <button
                type="button"
                onClick={() => setVisible((v) => !v)}
                disabled={disabled}
                className="absolute inset-y-0 start-3 flex h-full min-w-[44px] items-center justify-center text-[#707784] transition-colors active:text-[#111B18] disabled:opacity-50 dark:text-gray-500 dark:active:text-gray-200"
                aria-label={visible ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
            >
                {visible ? <Eye className="h-5 w-5" strokeWidth={1.5} /> : <EyeOff className="h-5 w-5" strokeWidth={1.5} />}
            </button>
        </div>
    );
}

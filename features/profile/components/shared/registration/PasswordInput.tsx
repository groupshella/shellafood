"use client";

import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { inputClassName } from "./FormField";

interface PasswordInputProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

export function PasswordInput({ value, onChange, placeholder }: PasswordInputProps) {
    const [visible, setVisible] = useState(false);

    return (
        <div className="relative" dir="ltr">
            <input
                type={visible ? "text" : "password"}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className={`${inputClassName} pe-12 text-start`}
                autoComplete="new-password"
                aria-required
            />
            <button
                type="button"
                onClick={() => setVisible((v) => !v)}
                className="absolute inset-y-0 end-3 flex items-center text-[#707784] transition-colors active:text-[#111B18]"
                aria-label={visible ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
            >
                {visible ? <Eye className="h-5 w-5" strokeWidth={1.5} /> : <EyeOff className="h-5 w-5" strokeWidth={1.5} />}
            </button>
        </div>
    );
}

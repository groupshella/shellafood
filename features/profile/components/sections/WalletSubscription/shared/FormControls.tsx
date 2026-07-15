"use client";

import { Calendar, ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import {
    FormField,
    inputClassName,
} from "@/features/profile/components/shared/registration/FormField";

export function FieldError({ message, id }: { message?: string; id?: string }) {
    if (!message) return null;
    return (
        <p
            id={id}
            role="alert"
            aria-live="polite"
            className="mt-1 text-start text-[12px] font-medium text-[#DB2626] dark:text-red-400"
        >
            {message}
        </p>
    );
}

function errorInputClass(hasError: boolean) {
    return hasError
        ? "border-[#DB2626] focus:border-[#DB2626] focus:ring-red-100 dark:border-red-500"
        : "";
}

interface TextInputProps {
    label: string;
    required?: boolean;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    type?: string;
    inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
    autoComplete?: string;
    dir?: "rtl" | "ltr";
    error?: string;
    fieldId: string;
    name: string;
}

export function TextInput({
    label,
    required,
    value,
    onChange,
    placeholder,
    type = "text",
    inputMode,
    autoComplete,
    dir = "rtl",
    error,
    fieldId,
    name,
}: TextInputProps) {
    const errorId = `${fieldId}-error`;
    return (
        <FormField label={label} required={required}>
            <input
                id={fieldId}
                name={name}
                type={type}
                inputMode={inputMode}
                autoComplete={autoComplete}
                placeholder={placeholder}
                value={value}
                dir={dir}
                onChange={(e) => onChange(e.target.value)}
                aria-required={required}
                aria-invalid={!!error}
                aria-describedby={error ? errorId : undefined}
                data-error={error ? "true" : undefined}
                className={`${inputClassName} ${dir === "rtl" ? "text-end" : "text-start"} ${errorInputClass(!!error)}`}
            />
            <FieldError message={error} id={errorId} />
        </FormField>
    );
}

interface DateInputProps {
    label: string;
    required?: boolean;
    value: string;
    onChange: (value: string) => void;
    error?: string;
    fieldId: string;
    name: string;
}

export function DateInput({
    label,
    required,
    value,
    onChange,
    error,
    fieldId,
    name,
}: DateInputProps) {
    const errorId = `${fieldId}-error`;
    return (
        <FormField label={label} required={required}>
            <div
                className={`${inputClassName} justify-between gap-2 ${errorInputClass(!!error)}`}
                data-error={error ? "true" : undefined}
            >
                <Calendar
                    className="h-5 w-5 shrink-0 text-[#555555] dark:text-gray-400"
                    strokeWidth={1.5}
                    aria-hidden
                />
                <input
                    id={fieldId}
                    name={name}
                    type="text"
                    inputMode="numeric"
                    placeholder="yyyy-mm-dd"
                    value={value}
                    dir="ltr"
                    onChange={(e) => onChange(e.target.value)}
                    aria-required={required}
                    aria-invalid={!!error}
                    aria-describedby={error ? errorId : undefined}
                    className="min-w-0 flex-1 bg-transparent text-end outline-none placeholder:text-[#707784] dark:placeholder:text-gray-500"
                />
            </div>
            <FieldError message={error} id={errorId} />
        </FormField>
    );
}

interface SelectFieldProps {
    label: string;
    required?: boolean;
    value: string;
    options: readonly string[];
    placeholder: string;
    onChange: (value: string) => void;
    error?: string;
    fieldId: string;
    extra?: React.ReactNode;
}

export function SelectField({
    label,
    required,
    value,
    options,
    placeholder,
    onChange,
    error,
    fieldId,
    extra,
}: SelectFieldProps) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    const errorId = `${fieldId}-error`;

    useEffect(() => {
        if (!open) return;
        const onPointerDown = (event: MouseEvent) => {
            if (!ref.current?.contains(event.target as Node)) setOpen(false);
        };
        document.addEventListener("mousedown", onPointerDown);
        return () => document.removeEventListener("mousedown", onPointerDown);
    }, [open]);

    return (
        <FormField label={label} required={required}>
            <div
                ref={ref}
                className="relative"
                id={fieldId}
                data-error={error ? "true" : undefined}
            >
                <button
                    type="button"
                    onClick={() => setOpen((p) => !p)}
                    aria-haspopup="listbox"
                    aria-expanded={open}
                    aria-invalid={!!error}
                    aria-describedby={error ? errorId : undefined}
                    className={`${inputClassName} justify-between text-start ${errorInputClass(!!error)}`}
                >
                    <div className="flex min-w-0 items-center gap-1.5">
                        {extra}
                        <span
                            className={
                                value
                                    ? "truncate font-medium text-[#111B18] dark:text-gray-100"
                                    : "truncate text-[#707784] dark:text-gray-500"
                            }
                        >
                            {value || placeholder}
                        </span>
                    </div>
                    <ChevronDown
                        className={`h-5 w-5 shrink-0 text-[#555555] transition-transform dark:text-gray-400 ${open ? "rotate-180" : ""}`}
                        strokeWidth={1.5}
                    />
                </button>
                {open && (
                    <ul
                        role="listbox"
                        className="absolute inset-x-0 top-[calc(100%+6px)] z-30 max-h-56 overflow-y-auto rounded-2xl border border-gray-100 bg-white shadow-[0_8px_30px_rgba(0,0,0,0.08)] dark:border-gray-700 dark:bg-gray-800"
                    >
                        {options.map((option, index) => (
                            <li key={option} role="option" aria-selected={value === option}>
                                <button
                                    type="button"
                                    onClick={() => {
                                        onChange(option);
                                        setOpen(false);
                                    }}
                                    className={`w-full px-4 py-3.5 text-end text-[14px] transition-colors active:bg-gray-50 dark:active:bg-gray-700 ${
                                        value === option
                                            ? "font-semibold text-[#30913F] dark:text-[#4db860]"
                                            : "text-[#111B18] dark:text-gray-100"
                                    } ${index > 0 ? "border-t border-gray-100 dark:border-gray-700" : ""}`}
                                >
                                    {option}
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            <FieldError message={error} id={errorId} />
        </FormField>
    );
}

interface RadioFieldProps {
    label: string;
    required?: boolean;
    options: readonly string[];
    value: string;
    onChange: (value: string) => void;
    error?: string;
    fieldId: string;
}

export function RadioField({
    label,
    required,
    options,
    value,
    onChange,
    error,
    fieldId,
}: RadioFieldProps) {
    const errorId = `${fieldId}-error`;
    return (
        <FormField label={label} required={required}>
            <div
                id={fieldId}
                role="radiogroup"
                aria-invalid={!!error}
                aria-describedby={error ? errorId : undefined}
                data-error={error ? "true" : undefined}
                className={[
                    "overflow-hidden rounded-xl border bg-[#F6F5F8] dark:bg-gray-800",
                    error
                        ? "border-[#DB2626] dark:border-red-500"
                        : "border-transparent",
                ].join(" ")}
            >
                {options.map((opt, i) => {
                    const selected = value === opt;
                    return (
                        <button
                            key={opt}
                            type="button"
                            role="radio"
                            aria-checked={selected}
                            onClick={() => onChange(opt)}
                            className={`flex w-full items-center justify-between px-4 py-3.5 text-[15px] ${
                                i > 0
                                    ? "border-t border-[#E8ECEF] bg-white dark:border-gray-700 dark:bg-gray-900"
                                    : ""
                            }`}
                        >
                            <span
                                className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                                    selected
                                        ? "border-[#30913F]"
                                        : "border-[#D1D5DB] dark:border-gray-600"
                                }`}
                            >
                                {selected && (
                                    <span className="h-2.5 w-2.5 rounded-full bg-[#30913F]" />
                                )}
                            </span>
                            <span className="font-medium text-[#111B18] dark:text-gray-100">
                                {opt}
                            </span>
                        </button>
                    );
                })}
            </div>
            <FieldError message={error} id={errorId} />
        </FormField>
    );
}

"use client";

import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { FormField, inputClassName } from "./FormField";

interface FormDropdownProps {
    label: string;
    value: string;
    options: readonly string[];
    onChange: (value: string) => void;
    placeholder: string;
    required?: boolean;
}

export function FormDropdown({
    label,
    value,
    options,
    onChange,
    placeholder,
    required,
}: FormDropdownProps) {
    const [open, setOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!open) return;

        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [open]);

    return (
        <FormField label={label} required={required}>
            <div ref={containerRef} className="relative">
                <button
                    type="button"
                    onClick={() => setOpen((prev) => !prev)}
                    aria-haspopup="listbox"
                    aria-expanded={open}
                    className={`${inputClassName} justify-between text-start`}
                >
                    <span className={value ? "font-medium text-[#111B18] dark:text-gray-100" : "text-[#707784] dark:text-gray-500"}>
                        {value || placeholder}
                    </span>
                    <ChevronDown
                        className={`h-5 w-5 shrink-0 text-[#555555] transition-transform dark:text-gray-400 ${open ? "rotate-180" : ""}`}
                        strokeWidth={1.5}
                    />
                </button>

                {open && (
                    <ul
                        role="listbox"
                        className="absolute inset-x-0 top-[calc(100%+6px)] right-0 z-20 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-[0_8px_30px_rgba(0,0,0,0.08)] dark:border-gray-700 dark:bg-gray-800 dark:shadow-[0_8px_30px_rgba(0,0,0,0.3)]"
                    >
                        {options.map((option, index) => (
                            <li key={option} role="option" aria-selected={value === option}>
                                <button
                                    type="button"
                                    onClick={() => {
                                        onChange(option);
                                        setOpen(false);
                                    }}
                                    className={`w-full px-4 py-3.5 text-start text-[14px] transition-colors active:bg-gray-50 dark:active:bg-gray-700 ${value === option
                                            ? "font-semibold text-[#30913F] dark:text-[#4db860]"
                                            : "text-gray-900 dark:text-gray-100"
                                        } ${index > 0 ? "border-t border-gray-100 dark:border-gray-700" : ""}`}
                                >
                                    {option}
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </FormField>
    );
}

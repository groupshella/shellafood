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
                    className={`${inputClassName} justify-between text-end`}
                >
                    <ChevronDown
                        className={`h-5 w-5 shrink-0 text-[#555555] transition-transform ${open ? "rotate-180" : ""}`}
                        strokeWidth={1.5}
                    />
                    <span className={value ? "font-medium text-[#111B18]" : "text-[#707784]"}>
                        {value || placeholder}
                    </span>
                </button>

                {open && (
                    <ul
                        role="listbox"
                        className="absolute inset-x-0 top-[calc(100%+6px)] z-20 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-[0_8px_30px_rgba(0,0,0,0.08)]"
                    >
                        {options.map((option, index) => (
                            <li key={option} role="option" aria-selected={value === option}>
                                <button
                                    type="button"
                                    onClick={() => {
                                        onChange(option);
                                        setOpen(false);
                                    }}
                                    className={`w-full px-4 py-3.5 text-end text-[14px] transition-colors active:bg-gray-50 ${
                                        value === option
                                            ? "font-semibold text-[#30913F]"
                                            : "text-gray-900"
                                    } ${index > 0 ? "border-t border-gray-100" : ""}`}
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

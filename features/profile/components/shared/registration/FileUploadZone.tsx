"use client";

import { Check, FileImage, ImagePlus, Trash2 } from "lucide-react";
import { useRef } from "react";
import { JOIN_STRINGS } from "@/features/profile/constants/join.strings";
import { formatFileSize } from "@/features/profile/lib/upload.lib";

interface UploadedFile {
    file: File;
    previewName: string;
}

interface FileUploadZoneProps {
    title: string;
    helperText?: string;
    uploaded: UploadedFile | null;
    onSelect: (file: File) => void;
    onRemove: () => void;
    accept?: string;
    variant?: "image" | "document";
}

export function FileUploadZone({
    title,
    helperText = JOIN_STRINGS.uploadHelper,
    uploaded,
    onSelect,
    onRemove,
    accept = "image/*",
    variant = "image",
}: FileUploadZoneProps) {
    const inputRef = useRef<HTMLInputElement>(null);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) onSelect(file);
        event.target.value = "";
    };

    if (uploaded) {
        return (
            <div className="flex items-center gap-3 rounded-2xl border border-[#30913F]/30 bg-[#E8F5E9] px-4 py-4">
                <button
                    type="button"
                    onClick={onRemove}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-red-500 transition-colors active:bg-red-50"
                    aria-label="حذف الملف"
                >
                    <Trash2 className="h-5 w-5" />
                </button>
                <div className="min-w-0 flex-1 text-end">
                    <p className="truncate text-[14px] font-semibold text-gray-900">
                        {uploaded.previewName || uploaded.file.name}
                    </p>
                    <p className="mt-0.5 text-[12px] text-gray-500">
                        {JOIN_STRINGS.fileSize(formatFileSize(uploaded.file.size))}
                    </p>
                </div>
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/60">
                    <FileImage className="h-5 w-5 text-[#30913F]" />
                </div>
            </div>
        );
    }

    const Icon = variant === "document" ? FileImage : ImagePlus;

    return (
        <>
            <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="flex w-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-gray-200 bg-white px-4 py-8 transition-colors active:border-[#30913F]/40 active:bg-gray-50/50"
            >
                <Icon className="h-7 w-7 text-gray-400" strokeWidth={1.5} />
                <p className="text-[14px] font-semibold text-gray-900">{title}</p>
                <p className="max-w-[260px] text-center text-[12px] leading-relaxed text-gray-500">
                    {helperText}
                </p>
            </button>
            <input
                ref={inputRef}
                type="file"
                accept={accept}
                className="hidden"
                onChange={handleChange}
            />
        </>
    );
}

interface TermsCheckboxProps {
    checked: boolean;
    onChange: (checked: boolean) => void;
    label?: string;
}

export function TermsCheckbox({
    checked,
    onChange,
    label = JOIN_STRINGS.agreeTerms,
}: TermsCheckboxProps) {
    return (
        <label className="flex cursor-pointer items-center gap-3 py-1">
            <span className="min-w-0 flex-1 text-end text-[14px] leading-relaxed text-gray-800">
                {label}
            </span>
            <button
                type="button"
                role="checkbox"
                aria-checked={checked}
                onClick={() => onChange(!checked)}
                className={`flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-md border-2 transition-colors ${checked
                        ? "border-[#30913F] bg-[#30913F] text-white"
                        : "border-gray-300 bg-white"
                    }`}
            >
                {checked && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
            </button>
        </label>
    );
}

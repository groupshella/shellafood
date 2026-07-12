"use client";

import { Copy, Check } from "lucide-react";
import { useState } from "react";
import { useLanguage } from "@/features/language/useLanguage";

interface ReferralLinkBoxProps {
    link: string;
}

export function ReferralLinkBox({ link }: ReferralLinkBoxProps) {
    const { isArabic } = useLanguage();
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(link);
            setCopied(true);
            window.setTimeout(() => setCopied(false), 2000);
        } catch {
            // Clipboard can fail silently
        }
    };

    return (
        <div className="flex w-full flex-col gap-2">
            <span className="text-start text-[14px] font-bold leading-none text-[#111B18] dark:text-gray-100">
                {isArabic ? "الرمز الشخصي الخاص بك" : "Your personal code"}
            </span>
            <div className="flex min-h-[56px] w-full items-center justify-between rounded-[12px] border border-dashed border-[#C6C8CE] bg-[#F6F5F8] px-4 py-2 dark:border-gray-600 dark:bg-gray-800">
                <span
                    className="min-w-0 flex-1 truncate text-start text-[16px] font-bold text-[#111B18] dark:text-gray-100"
                    dir="ltr"
                >
                    {link}
                </span>
                <button
                    type="button"
                    onClick={handleCopy}
                    aria-label={copied ? (isArabic ? "تم النسخ" : "Copied") : isArabic ? "نسخ الرابط" : "Copy link"}
                    className="ms-3 flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition-colors active:bg-gray-200/60 dark:active:bg-gray-700/60"
                >
                    {copied ? (
                        <Check className="h-6 w-6 text-[#30913F] dark:text-[#4db860]" strokeWidth={1.75} />
                    ) : (
                        <Copy className="h-6 w-6 text-[#555555] dark:text-gray-400" strokeWidth={1.75} />
                    )}
                </button>
            </div>
        </div>
    );
}

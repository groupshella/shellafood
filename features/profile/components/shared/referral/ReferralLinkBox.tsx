"use client";

import { Copy, Check } from "lucide-react";
import { useState } from "react";
import { REFERRAL_STRINGS } from "@/features/profile/constants/referral.strings";
import { REFERRAL_UI } from "@/features/profile/constants/referral.tokens";

interface ReferralLinkBoxProps {
    link: string;
}

export function ReferralLinkBox({ link }: ReferralLinkBoxProps) {
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
            <span className="text-start text-[14px] font-bold leading-none text-[#111B18]">
                {REFERRAL_STRINGS.personalCodeLabel}
            </span>
            <div className="flex h-[56px] w-full items-center justify-between rounded-[12px] border border-dashed border-[#C6C8CE] bg-[#F6F5F8] px-4 py-2">
                <span
                    className="min-w-0 flex-1 truncate text-start text-[16px] font-bold text-[#111B18]"
                    dir="ltr"
                >
                    {link}
                </span>
                <button
                    type="button"
                    onClick={handleCopy}
                    aria-label={REFERRAL_STRINGS.copied}
                    className="ms-3 flex shrink-0 items-center justify-center transition-opacity active:opacity-70"
                >
                    {copied ? (
                        <Check className="h-6 w-6 text-[#30913F]" strokeWidth={1.75} />
                    ) : (
                        <Copy
                            className="h-6 w-6"
                            style={{ color: REFERRAL_UI.copyIcon }}
                            strokeWidth={1.75}
                        />
                    )}
                </button>
            </div>
        </div>
    );
}

"use client";

import {
    formatLocalPhone,
    formatPhoneDisplay,
    normalizeLocalPhone,
} from "@/features/profile/lib/profile.lib";
import { inputClassName, readOnlyInputClassName } from "./formTokens";

function PhonePrefix() {
    return (
        <div className="flex shrink-0 items-center gap-2">
            <span className="text-[14px] font-normal text-foreground">+966</span>
            <span className="text-lg leading-none" aria-hidden>
                🇸🇦
            </span>
        </div>
    );
}

function PhoneDivider() {
    return <span className="mx-3 h-5 w-px shrink-0 bg-border" aria-hidden />;
}

interface PhoneFieldProps {
    value: string;
    onChange?: (value: string) => void;
    placeholder?: string;
    readOnly?: boolean;
}

export function PhoneField({
    value,
    onChange,
    placeholder = "5x xxx xxxx",
    readOnly = false,
}: PhoneFieldProps) {
    if (readOnly) {
        const { localNumber } = formatPhoneDisplay(value);

        return (
            <div className={`${readOnlyInputClassName} gap-0`} dir="ltr" aria-readonly>
                <PhonePrefix />
                <PhoneDivider />
                <span className="min-w-0 flex-1 ps-3 text-start tabular-nums">{localNumber}</span>
            </div>
        );
    }

    return (
        <div className={`${inputClassName} gap-0`} dir="ltr">
            <PhonePrefix />
            <PhoneDivider />
            <input
                type="tel"
                inputMode="numeric"
                value={formatLocalPhone(value)}
                onChange={(e) => onChange?.(normalizeLocalPhone(e.target.value))}
                placeholder={placeholder}
                className="min-w-0 flex-1 bg-transparent ps-3 text-start tabular-nums outline-none placeholder:text-muted"
                autoComplete="tel-national"
                aria-required
            />
        </div>
    );
}

/** @deprecated Use PhoneField */
export function PhoneInput(props: Omit<PhoneFieldProps, "readOnly">) {
    return <PhoneField {...props} />;
}

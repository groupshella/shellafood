"use client";

interface ProfileSwitchProps {
    checked: boolean;
    onChange: (checked: boolean) => void;
    ariaLabel: string;
}

export function ProfileSwitch({ checked, onChange, ariaLabel }: ProfileSwitchProps) {
    return (
        <button
            type="button"
            role="switch"
            aria-checked={checked}
            aria-label={ariaLabel}
            onClick={() => onChange(!checked)}
            className={[
                "relative h-[25px] w-[50px] shrink-0 rounded-[32px] transition-colors",
                checked ? "bg-[#30913F]" : "bg-[#D1D5DB]",
            ].join(" ")}
        >
            <span
                className={[
                    "absolute top-[2px] h-5 w-5 rounded-full bg-white transition-all",
                    checked ? "start-[26.5px]" : "start-[2px]",
                ].join(" ")}
            />
        </button>
    );
}

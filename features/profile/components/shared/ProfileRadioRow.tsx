"use client";

interface ProfileRadioRowProps {
    label: string;
    selected: boolean;
    onSelect: () => void;
}

export function ProfileRadioRow({ label, selected, onSelect }: ProfileRadioRowProps) {
    return (
        <button
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={onSelect}
            className="flex w-full items-center justify-between border-b border-gray-100 py-4 last:border-b-0"
        >
            <span className={`text-[15px] ${selected ? "font-bold text-gray-900" : "text-gray-900"}`}>
                {label}
            </span>
            <span
                className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                    selected ? "border-gray-900" : "border-gray-300"
                }`}
            >
                {selected && <span className="h-2.5 w-2.5 rounded-full bg-gray-900" />}
            </span>
        </button>
    );
}

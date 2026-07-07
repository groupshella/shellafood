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
            className="flex min-h-[52px] w-full items-center justify-between gap-4 border-b border-gray-100 px-1 py-4 transition-colors active:bg-gray-50 dark:border-gray-800 dark:active:bg-gray-800/60 last:border-b-0 sm:min-h-[56px] sm:px-2"
        >
            <span
                className={`min-w-0 flex-1 text-start text-[15px] dark:text-gray-100 sm:text-[16px] ${
                    selected ? "font-bold text-gray-900 dark:text-gray-50" : "text-gray-900"
                }`}
            >
                {label}
            </span>
            <span
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 sm:h-6 sm:w-6 ${
                    selected
                        ? "border-gray-900 dark:border-gray-100"
                        : "border-gray-300 dark:border-gray-600"
                }`}
            >
                {selected && (
                    <span className="h-2.5 w-2.5 rounded-full bg-gray-900 dark:bg-gray-100 sm:h-3 sm:w-3" />
                )}
            </span>
        </button>
    );
}

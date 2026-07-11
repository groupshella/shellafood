interface SearchChipProps {
    label: string;
    isActive?: boolean;
    onClick: () => void;
}

export function SearchChip({ label, isActive = false, onClick }: SearchChipProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={[
                "min-h-10 rounded-full px-3.5 py-2 text-sm font-bold transition-all duration-150 active:scale-[0.97]",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#30913F] focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-950",
                "sm:px-4 sm:text-[15px]",
                isActive
                    ? "bg-[#EBFEEB] text-[#267332] ring-2 ring-[#30913F] dark:bg-[#0d2e12] dark:text-[#4db860]"
                    : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
            ].join(" ")}
            aria-label={label}
            aria-pressed={isActive}
        >
            {label}
        </button>
    );
}

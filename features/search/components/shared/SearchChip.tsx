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
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                "sm:px-4 sm:text-[15px]",
                isActive
                    ? "bg-brand/10 text-brand ring-2 ring-brand"
                    : "bg-card text-foreground",
            ].join(" ")}
            aria-label={label}
            aria-pressed={isActive}
        >
            {label}
        </button>
    );
}

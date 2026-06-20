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
                "rounded-full bg-white px-4 py-2 text-sm font-medium text-black",
                "transition-transform active:scale-[0.98]",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#30913F] focus-visible:ring-offset-2 focus-visible:ring-offset-black",
                isActive ? "ring-2 ring-[#30913F]" : "",
            ].join(" ")}
            aria-label={label}
            aria-pressed={isActive}
        >
            {label}
        </button>
    );
}

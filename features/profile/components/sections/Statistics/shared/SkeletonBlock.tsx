export function SkeletonBlock({ className }: { className?: string }) {
    return (
        <div
            className={["animate-pulse rounded-[8px] bg-[#F0EFF3] dark:bg-gray-700", className]
                .filter(Boolean)
                .join(" ")}
        />
    );
}

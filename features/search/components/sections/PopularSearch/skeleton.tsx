export default function PopularSearchSkeleton() {
    return (
        <div className="space-y-3 sm:space-y-4">
            <div className="h-5 w-28 animate-pulse rounded bg-card sm:h-6 sm:w-32" />
            <div className="flex flex-wrap gap-2 sm:gap-2.5 lg:gap-3">
                {Array.from({ length: 8 }).map((_, i) => (
                    <div
                        key={i}
                        className="h-10 w-20 animate-pulse rounded-full bg-card sm:h-11 sm:w-24"
                    />
                ))}
            </div>
        </div>
    );
}

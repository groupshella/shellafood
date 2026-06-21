export default function PopularSearchSkeleton() {
    return (
        <div className="space-y-3">
            <div className="h-5 w-28 animate-pulse rounded bg-gray-200" />
            <div className="flex flex-wrap gap-2">
                {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="h-9 w-24 animate-pulse rounded-full bg-gray-200" />
                ))}
            </div>
        </div>
    );
}

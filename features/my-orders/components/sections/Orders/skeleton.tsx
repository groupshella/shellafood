export default function OrdersSkeleton() {
    return (
        <div className="space-y-3 px-4 py-4">
            {/* Tabs skeleton */}
            <div className="flex gap-2 pb-1">
                {[80, 100, 140, 90].map((w, i) => (
                    <div
                        key={i}
                        className="h-8 animate-pulse rounded-full bg-gray-200"
                        style={{ width: w }}
                    />
                ))}
            </div>
            {/* Card skeletons */}
            {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/[0.04]">
                    <div className="mb-3 flex items-start justify-between gap-3">
                        <div className="flex-1 space-y-2">
                            <div className="h-4 w-3/5 animate-pulse rounded bg-gray-200" />
                            <div className="h-3 w-2/5 animate-pulse rounded bg-gray-100" />
                        </div>
                        <div className="h-6 w-20 animate-pulse rounded-full bg-gray-200" />
                    </div>
                    <div className="mb-3 h-3 w-4/5 animate-pulse rounded bg-gray-100" />
                    <div className="flex justify-between border-t border-gray-100 pt-3">
                        <div className="h-3 w-14 animate-pulse rounded bg-gray-100" />
                        <div className="h-4 w-20 animate-pulse rounded bg-gray-200" />
                    </div>
                </div>
            ))}
        </div>
    );
}

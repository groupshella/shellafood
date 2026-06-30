export default function StoresTabSkeleton() {
    return (
        <div className="space-y-4 px-4 py-4">
            {Array.from({ length: 3 }).map((_, i) => (
                <div
                    key={i}
                    className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/[0.04]"
                >
                    <div className="h-[140px] w-full animate-pulse bg-gray-200" />
                    <div className="flex items-center gap-3 px-4 py-3">
                        <div className="h-12 w-12 shrink-0 animate-pulse rounded-xl bg-gray-200" />
                        <div className="flex-1 space-y-2">
                            <div className="h-4 w-2/3 animate-pulse rounded bg-gray-200" />
                            <div className="h-3 w-1/3 animate-pulse rounded bg-gray-100" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

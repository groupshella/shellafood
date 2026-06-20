export default function StoresSkeleton() {
    return (
        <div className="mx-auto w-full max-w-2xl space-y-3 px-4 sm:px-6">
            <div className="h-5 w-40 animate-pulse rounded bg-gray-100" />
            <div className="flex gap-2 overflow-hidden">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="h-8 w-20 shrink-0 animate-pulse rounded-full bg-gray-100" />
                ))}
            </div>
            <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                    <div
                        key={i}
                        className="flex items-center gap-3 rounded-2xl bg-white p-3 ring-1 ring-black/[0.04]"
                    >
                        <div className="h-[72px] w-[72px] shrink-0 animate-pulse rounded-xl bg-gray-100" />
                        <div className="flex-1 space-y-2">
                            <div className="h-4 w-2/3 animate-pulse rounded bg-gray-100" />
                            <div className="h-3 w-1/2 animate-pulse rounded bg-gray-100" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

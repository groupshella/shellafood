export default function RecentOrderSkeleton() {
    return (
        <div className="mx-auto w-full max-w-5xl space-y-3 px-4">
            <div className="h-7 w-32 animate-pulse rounded-lg bg-gray-100" />
            <div className="space-y-2.5">
                {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-sm ring-1 ring-black/[0.05]">
                        <div className="h-[52px] w-[52px] shrink-0 animate-pulse rounded-xl bg-gray-100" />
                        <div className="flex-1 space-y-2">
                            <div className="h-3.5 w-2/3 animate-pulse rounded bg-gray-100" />
                            <div className="flex items-center gap-1.5">
                                <div className="h-5 w-16 animate-pulse rounded-full bg-gray-100" />
                                <div className="h-3 w-20 animate-pulse rounded bg-gray-100" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

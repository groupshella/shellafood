export default function CategoryDetailSkeleton() {
    return (
        <div className="space-y-4 px-3 py-4 sm:px-5 lg:px-6">
            {Array.from({ length: 2 }).map((_, sectionIndex) => (
                <div key={sectionIndex} className="space-y-2">
                    <div className="h-5 w-32 animate-pulse rounded bg-card" />
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-2.5 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                        {Array.from({ length: 6 }).map((__, i) => (
                            <div
                                key={i}
                                className="flex min-h-[180px] flex-col rounded-lg bg-background p-2 shadow-[0_1px_4px_rgba(0,0,0,0.06)] ring-1 ring-border sm:min-h-[190px]"
                            >
                                <div className="mx-auto mt-2 h-14 w-14 animate-pulse rounded bg-card sm:h-[66px] sm:w-[66px]" />
                                <div className="mt-2 h-6 w-full animate-pulse rounded bg-card" />
                                <div className="mt-1 h-4 w-12 animate-pulse rounded bg-border" />
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}

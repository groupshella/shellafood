export default function CategoryDetailSkeleton() {
    return (
        <div className="space-y-4 px-4 py-4">
            {Array.from({ length: 2 }).map((_, sectionIndex) => (
                <div key={sectionIndex} className="space-y-2">
                    <div className="h-5 w-32 animate-pulse rounded bg-gray-200" />
                    <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
                        {Array.from({ length: 6 }).map((__, i) => (
                            <div
                                key={i}
                                className="flex flex-col rounded-[6px] bg-white p-2 shadow-[0_1px_4px_rgba(0,0,0,0.06)]"
                            >
                                <div className="mx-auto mt-2 h-[66px] w-[66px] animate-pulse rounded bg-gray-200" />
                                <div className="mt-2 h-6 w-full animate-pulse rounded bg-gray-200" />
                                <div className="mt-1 ms-auto h-4 w-12 animate-pulse rounded bg-gray-200" />
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}

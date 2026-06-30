export default function StoreCategoryProductsSkeleton() {
    return (
        <div className="animate-pulse px-3 pb-4 pt-3">
            {/* Section heading */}
            <div className="mb-3 h-5 w-32 rounded bg-gray-200 ms-auto" />

            {/* Product card skeletons */}
            <div className="flex flex-col gap-3">
                {Array.from({ length: 5 }).map((_, i) => (
                    <div
                        key={i}
                        className="flex w-full items-center gap-3 rounded-2xl bg-white px-3 py-3"
                    >
                        {/* Image placeholder */}
                        <div className="h-[80px] w-[80px] shrink-0 rounded-xl bg-gray-100" />

                        {/* Text placeholder */}
                        <div className="min-w-0 flex-1 space-y-2">
                            <div className="h-4 w-full rounded bg-gray-100" />
                            <div className="h-4 w-3/4 rounded bg-gray-100" />
                            <div className="h-5 w-16 rounded bg-gray-100" />
                        </div>

                        {/* Actions placeholder */}
                        <div className="flex shrink-0 flex-col gap-3">
                            <div className="h-8 w-8 rounded-full bg-gray-100" />
                            <div className="h-8 w-8 rounded-full bg-gray-100" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default function BrandItemsSkeleton() {
    return (
        <section className="bg-[#F6F5F8] pb-28">
            {/* toolbar */}
            <div className="flex items-center justify-between bg-white px-4 py-2.5">
                <div className="flex gap-2">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="h-9 w-9 animate-pulse rounded-[10px] bg-gray-100" />
                    ))}
                </div>
                <div className="h-4 w-16 animate-pulse rounded bg-gray-100" />
            </div>

            {/* product grid */}
            <div className="grid grid-cols-3 gap-2 px-4 pt-2 sm:grid-cols-4 sm:px-5 md:grid-cols-5">
                {Array.from({ length: 12 }).map((_, i) => (
                    <div
                        key={i}
                        className="flex flex-col overflow-hidden rounded-xl bg-white shadow-[0_2px_8px_rgba(0,0,0,0.07)]"
                    >
                        <div className="aspect-square w-full animate-pulse bg-gray-100" />
                        <div className="space-y-1.5 px-2 py-2">
                            <div className="h-3 w-full animate-pulse rounded bg-gray-100" />
                            <div className="h-3 w-3/4 animate-pulse rounded bg-gray-100" />
                            <div className="h-3 w-1/2 animate-pulse rounded bg-gray-200" />
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}

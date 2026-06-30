export default function ProductsTabSkeleton() {
    return (
        <div className="space-y-3 px-4 py-4">
            {Array.from({ length: 5 }).map((_, i) => (
                <div
                    key={i}
                    className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-sm ring-1 ring-black/[0.04]"
                >
                    <div className="h-[72px] w-[72px] shrink-0 animate-pulse rounded-xl bg-gray-200" />
                    <div className="flex-1 space-y-2">
                        <div className="h-4 w-4/5 animate-pulse rounded bg-gray-200" />
                        <div className="h-3 w-2/5 animate-pulse rounded bg-gray-100" />
                        <div className="h-4 w-1/3 animate-pulse rounded bg-gray-200" />
                    </div>
                    <div className="flex shrink-0 flex-col gap-2">
                        <div className="h-8 w-8 animate-pulse rounded-full bg-gray-200" />
                        <div className="h-8 w-8 animate-pulse rounded-full bg-gray-100" />
                    </div>
                </div>
            ))}
        </div>
    );
}

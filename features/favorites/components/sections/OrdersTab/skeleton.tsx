export default function OrdersTabSkeleton() {
    return (
        <div className="space-y-3 px-4 py-4">
            {Array.from({ length: 4 }).map((_, i) => (
                <div
                    key={i}
                    className="flex h-[110px] overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/[0.04]"
                >
                    <div className="w-[80px] shrink-0 animate-pulse rounded-l-2xl bg-gray-100" />
                    <div className="flex flex-1 flex-col gap-2 px-4 py-3.5">
                        <div className="h-4 w-2/5 animate-pulse rounded bg-gray-200" />
                        <div className="h-3 w-3/5 animate-pulse rounded bg-gray-100" />
                        <div className="h-5 w-16 animate-pulse rounded-full bg-gray-100" />
                        <div className="h-3 w-4/5 animate-pulse rounded bg-gray-100" />
                    </div>
                </div>
            ))}
        </div>
    );
}

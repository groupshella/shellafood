export default function DeliveryMethodSkeleton() {
    return (
        <div dir="rtl">
            <div className="mb-3 h-4 w-28 animate-pulse rounded bg-gray-200" />
            <div className="space-y-3">
                {Array.from({ length: 2 }).map((_, i) => (
                    <div
                        key={i}
                        className="flex items-center justify-between rounded-xl border border-gray-200 bg-[#F6F5F8] p-4"
                    >
                        <div className="space-y-1.5">
                            <div className="h-3.5 w-36 animate-pulse rounded bg-gray-200" />
                            <div className="h-3 w-20 animate-pulse rounded bg-gray-100" />
                        </div>
                        <div className="h-5 w-5 animate-pulse rounded-full bg-gray-200" />
                    </div>
                ))}
            </div>
        </div>
    );
}

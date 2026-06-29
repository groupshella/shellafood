export default function InvoiceDetailsSkeleton() {
    return (
        <div dir="rtl">
            <div className="mb-3 h-4 w-32 animate-pulse rounded bg-gray-200" />
            <div className="rounded-2xl bg-[#F6F5F8] p-4">
                <div className="space-y-3">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="flex items-center justify-between">
                            <div className="h-3 w-20 animate-pulse rounded bg-gray-200" />
                            <div className="h-3 w-16 animate-pulse rounded bg-gray-200" />
                        </div>
                    ))}
                    <div className="border-t border-gray-200 pt-3">
                        <div className="flex items-center justify-between">
                            <div className="h-4 w-24 animate-pulse rounded bg-gray-300" />
                            <div className="h-4 w-20 animate-pulse rounded bg-gray-300" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

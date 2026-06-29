export default function PaymentMethodSkeleton() {
    return (
        <div dir="rtl">
            <div className="mb-3 h-4 w-24 animate-pulse rounded bg-gray-200" />
            <div className="flex gap-3">
                {Array.from({ length: 3 }).map((_, i) => (
                    <div
                        key={i}
                        className="flex min-w-[100px] shrink-0 flex-col items-center gap-1.5 rounded-xl border border-gray-200 bg-white p-3"
                    >
                        <div className="h-6 w-6 animate-pulse rounded-md bg-gray-200" />
                        <div className="h-3 w-14 animate-pulse rounded bg-gray-200" />
                        <div className="h-2.5 w-10 animate-pulse rounded bg-gray-100" />
                    </div>
                ))}
            </div>
        </div>
    );
}

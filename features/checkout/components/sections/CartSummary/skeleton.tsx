export default function CartSummarySkeleton() {
    return (
        <div dir="rtl">
            <div className="mb-3 h-4 w-40 animate-pulse rounded bg-gray-200" />
            <div className="flex gap-2">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div
                        key={i}
                        className="h-[52px] w-[52px] shrink-0 animate-pulse rounded-xl border border-gray-200 bg-gray-100"
                    />
                ))}
            </div>
        </div>
    );
}

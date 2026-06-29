export default function DiscountCodeSkeleton() {
    return (
        <div dir="rtl">
            <div className="mb-3 h-4 w-32 animate-pulse rounded bg-gray-200" />
            <div className="flex items-center gap-2 rounded-xl bg-[#F6F5F8] p-1.5">
                <div className="h-10 flex-1 animate-pulse rounded-lg bg-gray-200" />
                <div className="h-10 w-16 shrink-0 animate-pulse rounded-lg bg-gray-300" />
            </div>
        </div>
    );
}

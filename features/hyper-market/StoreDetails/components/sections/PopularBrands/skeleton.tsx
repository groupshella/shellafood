export default function PopularBrandsSkeleton() {
    const columnWidth = "calc((100% - 0.75rem) / 2.08)";

    return (
        <section className="w-full bg-[#F5F5F5] px-4 pb-5 pt-3 sm:px-5" dir="rtl">
            <div className="mb-3 h-7 w-48 animate-pulse rounded-lg bg-gray-200" />
            <div className="flex gap-2.5 overflow-hidden sm:gap-3">
                {Array.from({ length: 3 }).map((_, i) => (
                    <div
                        key={i}
                        className="flex shrink-0 flex-col gap-2 sm:gap-2.5"
                        style={{ width: columnWidth }}
                    >
                        <div className="h-[76px] animate-pulse rounded-2xl bg-gray-200" />
                        <div className="h-[76px] animate-pulse rounded-2xl bg-gray-200" />
                    </div>
                ))}
            </div>
        </section>
    );
}
